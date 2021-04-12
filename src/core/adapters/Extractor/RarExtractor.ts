import { Extractor } from ".";
import { FileFormatNotSupportedError } from "./errors";
import path from "path";

export class RarExtractor extends Extractor {
  public extract = async (filePath: string, dist: string): Promise<void> => {
    if (path.extname(filePath) !== ".rar") {
      if (this.next) {
        return await this.next.extract(filePath, dist);
      } else {
        throw new FileFormatNotSupportedError("File type not supported");
      }
    }

    throw new FileFormatNotSupportedError(
      "RARサポートしたかったけどできなかった"
    );
  };
}
