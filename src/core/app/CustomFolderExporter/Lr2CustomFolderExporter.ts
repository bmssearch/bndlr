import { CustomFolderExporter } from "./CustomFolderExporter";
import { DestinationNotFoundError } from "../../models/errors";
import { IdentifiedFileNamer } from "../IdentifiedFileNamer";
//@ts-ignore
import SqlString from "sqlstring-sqlite";
import fse from "fs-extra";
import iconv from "iconv-lite";
import path from "path";
import uuid from "short-uuid";

export class Lr2CustomFolderExporter extends CustomFolderExporter {
  public clean = async () => {
    const fileNamer = new IdentifiedFileNamer();

    const groupFileNameBaseSet = new Set(
      this.groupBmsLists.map(({ group }) => {
        return fileNamer.name(group);
      })
    );

    let files: string[];
    try {
      files = await fse.readdir(this.dest);
    } catch (err) {
      throw new DestinationNotFoundError(err);
    }

    for (const file of files) {
      const match = file.match(/(.+)@(.+?)\.lr2folder$/);
      if (match && groupFileNameBaseSet.has(match[1])) {
        const absolutePath = path.join(this.dest, file);
        await fse.remove(absolutePath);
      }
    }
  };

  public export = async () => {
    await Promise.all(
      this.groupBmsLists.map(async ({ group, bmses }) => {
        const fileNamer = new IdentifiedFileNamer();

        const customFolder = new Lr2CustomFolder(
          group.name,
          "all",
          bmses.map((bms) => fileNamer.name(bms))
        );
        const body = customFolder.format();
        const encoded = iconv.encode(body, "Shift_JIS");

        // ファイル名を変更しないとLR2が更新を読み込まない
        const fileName = fileNamer.name(group) + "@" + uuid.generate();

        await fse.writeFile(
          path.join(this.dest, `${fileName}.lr2folder`),
          encoded
        );
      })
    );
  };
}

type TracksVisibility = "all" | "random";
class Lr2CustomFolder {
  constructor(
    private title: string,
    private tracksVisibility: TracksVisibility,
    private directoryNames: string[]
  ) {}

  public format = () => {
    // はファイル名に含むことができない ">" をエスケープに使用する
    const wheres = this.directoryNames.map((directoryName) => {
      const likeEscaped = directoryName
        .replaceAll("%", ">%")
        .replaceAll("_", ">_");
      const searchParam = SqlString.escape(`%${likeEscaped}%`);
      return `path LIKE ${searchParam}`;
    });

    const query = wheres.join(" OR ").concat(" ESCAPE '>'");

    const formatted = `#TITLE ${this.title}
#MAXTRACKS ${this.tracksVisibility === "all" ? 0 : 1}
#COMMAND ${query}
`;
    return formatted;
  };
}
