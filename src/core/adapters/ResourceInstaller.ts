import { Downloader } from "./Downloader";
import { Extractor } from "./Extractor";
import { TemporaryDiskProviderFactory } from "./TemporaryDiskProvider";
import fse from "fs-extra";

const WORKING_DIR = "F:\\temporary\\BMS";

export class ResourceInstaller {
  constructor(
    private tdpFactory: TemporaryDiskProviderFactory,
    private downloader: Downloader,
    private extractor: Extractor
  ) {}

  public install = async (url: string, dist: string): Promise<void> => {
    const tdp = this.tdpFactory.create(WORKING_DIR);
    const downloaded = await this.downloader.download(url, tdp.path);
    console.log("DOWNLOADED", downloaded);

    const extracted = await this.extractor.extract(
      downloaded.filePath,
      tdp.path
    );
    console.log("EXTRACTED", extracted);

    await fse.copy(extracted.dirPath, dist, { overwrite: true });
    console.log("COPIED");

    await tdp.destroy();
    console.log("INSTALLED");
  };
}
