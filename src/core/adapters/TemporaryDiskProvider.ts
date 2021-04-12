import fs from "fs";
import nodePath from "path";
import { v4 as uuidv4 } from "uuid";

export class TemporaryDiskProvider {
  constructor(public readonly path: string) {
    if (fs.existsSync(path)) {
      throw "Directory already exists";
    }

    fs.mkdirSync(path, { recursive: true });
  }

  public destroy = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      fs.rm(
        this.path,
        { recursive: true, force: true, maxRetries: 10 },
        (err) => {
          if (err) {
            reject(err);
            return;
          }

          resolve();
        }
      );
    });
  };
}

export class TemporaryDiskProviderFactory {
  constructor(private rootPath: string) {}

  public create = (): TemporaryDiskProvider => {
    const path = nodePath.join(this.rootPath, "_tmp-" + uuidv4());
    return new TemporaryDiskProvider(path);
  };
}
