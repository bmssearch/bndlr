import { ExceedsMaximumSizeError, FileFormatNotSupportedError } from "./errors";

import { Extractor } from ".";
import fs from "fs";
import path from "path";
import unzipper from "unzipper";

export class ZipExtractor extends Extractor {
  public extract = async (filePath: string, dist: string): Promise<void> => {
    if (path.extname(filePath) !== ".zip") {
      if (this.next) {
        return await this.next.extract(filePath, dist);
      } else {
        throw new FileFormatNotSupportedError("File type not supported");
      }
    }

    const extractedSize = await estimateExtractedSize(filePath);
    if (this.maxExtractedSizeByte < extractedSize) {
      throw new ExceedsMaximumSizeError(
        "Estimated extracted file size exceeds"
      );
    }

    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(filePath);

      stream.on("error", (err) => {
        stream.destroy();
        reject(err);
      });

      const extractStream = stream.pipe(unzipper.Extract({ path: dist }));
      extractStream.on("error", (err) => {
        stream.destroy();
        reject(err);
      });
      extractStream.on("finish", () => {
        stream.destroy();
        resolve();
      });
    });
  };
}

const estimateExtractedSize = (filePath: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    let extractedSize = 0;

    const readStream = fs.createReadStream(filePath);
    readStream.on("error", (err) => {
      reject(err);
    });

    const parseStream = readStream.pipe(unzipper.Parse());
    parseStream.on("entry", (entry) => {
      extractedSize += entry.vars.uncompressedSize;
      entry.autodrain();
    });
    parseStream.on("error", (err) => {
      readStream.destroy();
      reject(err);
    });
    parseStream.on("finish", () => {
      readStream.destroy();
      resolve(extractedSize);
    });
  });
};
