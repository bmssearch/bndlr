import fs from "fs";
import nodePath from "path";
import unzipper from "unzipper";

interface ExtractResult {
  dirPath: string;
}

export class Extractor {
  public extract = (
    filePath: string,
    targetDirPath: string
  ): Promise<ExtractResult> => {
    return new Promise((resolve, reject) => {
      // TODO: 最大展開サイズを設定する

      const outPath = nodePath.join(targetDirPath, "extracted"); // だばぁ回避のため

      const inFile = fs.createReadStream(filePath);
      inFile.on("error", (err) => reject(err));

      const stream = inFile.pipe(unzipper.Extract({ path: outPath }));
      stream.on("close", () => {
        resolve({ dirPath: outPath });
      });
      stream.on("error", (err) => reject(err));
    });
  };
}
