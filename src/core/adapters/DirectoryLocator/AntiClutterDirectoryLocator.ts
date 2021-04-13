import { DirectoryLocator } from ".";
import fse from "fs-extra";
import path from "path";

export class AntiClutterDirectoryLocator implements DirectoryLocator {
  public copy = async (src: string, dest: string): Promise<void> => {
    const dirs = await fse.readdir(src, { withFileTypes: true });

    if (dirs.length === 1 && dirs[0].isDirectory()) {
      await this.copy(path.join(src, dirs[0].name), dest);
      return;
    }

    await fse.copy(src, dest, { overwrite: true });
  };
}
