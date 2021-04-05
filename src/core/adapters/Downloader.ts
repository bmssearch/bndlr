import { URL } from "url";
import fs from "fs";
import { https } from "follow-redirects";
import path from "path";

interface DownloadResult {
  filePath: string;
}

interface ConnectionProgress {
  type: "connecting";
}
interface TransferProgress {
  type: "transfer";
  transferedByte: number;
  totalByte?: number;
}
type Progress = ConnectionProgress | TransferProgress;

type ProgressHandler = (progress: Progress) => void;

export class Downloader {
  private progressListeners: ProgressHandler[] = [];

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

      this.progressListeners.forEach((h) => h({ type: "connecting" }));

      const request = (url: string) =>
        https.get(url, (res) => {
          const rawContentLength = res.headers["content-length"];
          const contentLength = rawContentLength
            ? Number(rawContentLength)
            : undefined;
          let transferedByte = 0;

          res.pipe(outfile);

          res.on("data", (chunk) => {
            transferedByte += chunk.length;
            this.progressListeners.forEach((h) =>
              h({ type: "transfer", transferedByte, totalByte: contentLength })
            );
          });

          res.on("error", (err) => reject(err));

          res.on("end", () => {
            outfile.close();
            resolve({ filePath: outPath });
          });
        });
      request(url);
    });
  };

  public onProgress = (handler: ProgressHandler) => {
    this.progressListeners.push(handler);
  };
}

export class DownloaderFactory {
  public create = () => new Downloader();
}
