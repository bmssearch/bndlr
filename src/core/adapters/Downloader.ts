import { URL } from "url";
import fs from "fs";
import { https } from "follow-redirects";
import path from "path";

interface DownloadResult {
  filePath: string;
}

export class Downloader {
  public download = (
    url: string,
    filePath: string
  ): Promise<DownloadResult> => {
    return new Promise((resolve, reject) => {
      // TODO: 最大ファイルサイズを設定する

      const pathName = new URL(url).pathname;
      const rawFileName = path.basename(pathName);
      const fileName = decodeURIComponent(rawFileName);
      const outPath = path.join(filePath, fileName);

      const outfile = fs.createWriteStream(outPath);
      outfile.on("error", (err) => reject(err));

      const request = (url: string) =>
        https.get(url, (res) => {
          res.pipe(outfile);
          res.on("error", (err) => reject(err));
          res.on("end", () => {
            outfile.close();
            resolve({ filePath: outPath });
          });
        });
      request(url);
    });
  };
}
