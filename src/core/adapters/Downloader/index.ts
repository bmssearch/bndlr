import { DownloadResult, ProgressHandler } from "./types";

import { DownloadUrlModifier } from "../DownloadUrlModifier";
import { ExceedsMaximumSizeError } from "./errors";
import { URL } from "url";
import fs from "fs";
import { https } from "follow-redirects";
import path from "path";

export class Downloader {
  private progressListeners: ProgressHandler[] = [];

  constructor(
    private maxSizeByte: number,
    private downloadUrlModifiers: DownloadUrlModifier[]
  ) {}

  public download = (rawUrl: string, dist: string): Promise<DownloadResult> => {
    return new Promise((resolve, reject) => {
      const url = this.downloadUrlModifiers.reduce(
        (accUrl, modifier) => modifier.modify(accUrl),
        rawUrl
      );

      const pathName = new URL(url).pathname;
      const rawFileName = path.basename(pathName);
      const fileName = decodeURIComponent(rawFileName);
      const outPath = path.join(dist, fileName);

      const outfileStream = fs.createWriteStream(outPath);
      outfileStream.on("error", (err) => {
        reject(err);
      });

      this.progressListeners.forEach((h) => h({ type: "connecting" }));

      const request = https.get(url, (res) => {
        const rawContentLength = res.headers["content-length"];
        const contentLength = rawContentLength
          ? Number(rawContentLength)
          : undefined;
        let transferedByte = 0;

        if (contentLength && this.maxSizeByte < contentLength) {
          outfileStream.destroy();
          reject(new ExceedsMaximumSizeError("Request exceeds max size"));
        }

        res.pipe(outfileStream);

        outfileStream.on("data", (chunk) => {
          transferedByte += chunk.length;
          this.progressListeners.forEach((h) =>
            h({ type: "transfer", transferedByte, totalByte: contentLength })
          );

          if (this.maxSizeByte < transferedByte) {
            outfileStream.destroy();
            reject(new ExceedsMaximumSizeError("Request exceeds max size"));
          }
        });

        outfileStream.on("error", (err) => {
          outfileStream.destroy();
          reject(err);
        });

        outfileStream.on("finish", () => {
          outfileStream.close();
          resolve({ filePath: outPath });
        });
      });

      request.on("error", (err) => {
        outfileStream.destroy();
        reject(err);
      });

      request.end();
    });
  };

  public onProgress = (handler: ProgressHandler) => {
    this.progressListeners.push(handler);
  };
}

export class DownloaderFactory {
  constructor(
    private maxSizeByte: number,
    private downloadUrlModifiers: DownloadUrlModifier[]
  ) {}

  public create = () =>
    new Downloader(this.maxSizeByte, this.downloadUrlModifiers);
}
