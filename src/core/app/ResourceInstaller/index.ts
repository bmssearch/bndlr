import { ProgressHandler, ResourceInstallerProgress } from "./types";

import { DestinationNotFoundError } from "./errors";
import { DirectoryLocator } from "../../adapters/DirectoryLocator";
import { DownloaderFactory } from "../../adapters/Downloader";
import { ExtractorFactoryAbstract } from "../../adapters/Extractor";
import { TemporaryDiskProviderFactory } from "../../adapters/TemporaryDiskProvider";
import fse from "fs-extra";
import path from "path";

export class ResourceInstaller {
  private progressListeners: ProgressHandler[] = [];

  constructor(
    private tdpFactory: TemporaryDiskProviderFactory,
    private downloaderFactory: DownloaderFactory,
    private extractorFactory: ExtractorFactoryAbstract,
    private directoryLocator: DirectoryLocator
  ) {}

  public install = async (
    url: string,
    destRoot: string,
    folderName: string
  ): Promise<void> => {
    if (!(await fse.pathExists(destRoot))) {
      throw new DestinationNotFoundError(
        `インストール先「${destRoot}」は存在しません。正しいインストール先を指定してください。`
      );
    }

    const tdp = this.tdpFactory.create();

    const downloader = this.downloaderFactory.create();
    downloader.onProgress((progress) => {
      switch (progress.type) {
        case "connecting":
          this.emitProgress({ type: "connecting" });
          break;
        case "transfer":
          this.emitProgress({
            type: "transferring",
            transferedByte: progress.transferedByte,
            totalByte: progress.totalByte,
          });
      }
    });
    const downloaded = await downloader.download(url, tdp.path);

    this.emitProgress({ type: "extracting" });
    const extractor = this.extractorFactory.create();
    const extractPath = path.join(tdp.path, "extracted");
    await extractor.extract(downloaded.filePath, extractPath);

    this.emitProgress({ type: "copying" });
    await this.directoryLocator.copy(
      extractPath,
      path.join(destRoot, folderName)
    );

    this.emitProgress({ type: "cleaning" });
    await tdp.destroy();
  };

  public onProgress = (progressHandler: ProgressHandler) => {
    this.progressListeners.push(progressHandler);
  };

  private emitProgress = (progress: ResourceInstallerProgress) => {
    this.progressListeners.forEach((listener) => listener(progress));
  };
}

export class ResourceInstallerFactory {
  constructor(
    private tdpFactory: TemporaryDiskProviderFactory,
    private downloaderFactory: DownloaderFactory,
    private extractorFactory: ExtractorFactoryAbstract,
    private directoryLocator: DirectoryLocator
  ) {}

  public create = () =>
    new ResourceInstaller(
      this.tdpFactory,
      this.downloaderFactory,
      this.extractorFactory,
      this.directoryLocator
    );
}
