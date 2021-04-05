import { DownloaderFactory } from "./Downloader";
import { ExtractorFactory } from "./Extractor";
import { TemporaryDiskProviderFactory } from "./TemporaryDiskProvider";
import fse from "fs-extra";

const WORKING_DIR = "F:\\temporary\\BMS";

interface ConnectingProgress {
  type: "connecting";
}
interface TransferringProgress {
  type: "transferring";
  transferedByte: number;
  totalByte?: number;
}
interface ExtractingProgress {
  type: "extracting";
}
interface CopyingProgress {
  type: "copying";
}
interface CleaningProgress {
  type: "cleaning";
}
export type ResourceInstallerProgress =
  | ConnectingProgress
  | TransferringProgress
  | ExtractingProgress
  | CopyingProgress
  | CleaningProgress;

type ProgressHandler = (progress: ResourceInstallerProgress) => void;

export class ResourceInstaller {
  private progressListeners: ProgressHandler[] = [];

  constructor(
    private tdpFactory: TemporaryDiskProviderFactory,
    private downloaderFactory: DownloaderFactory,
    private extractorFactory: ExtractorFactory
  ) {}

  public install = async (url: string, dist: string): Promise<void> => {
    const tdp = this.tdpFactory.create(WORKING_DIR);

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

    const extractor = this.extractorFactory.create();
    this.emitProgress({ type: "extracting" });
    const extracted = await extractor.extract(downloaded.filePath, tdp.path);

    this.emitProgress({ type: "copying" });
    await fse.copy(extracted.dirPath, dist, { overwrite: true });

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
    private extractorFactory: ExtractorFactory
  ) {}

  public create = () =>
    new ResourceInstaller(
      this.tdpFactory,
      this.downloaderFactory,
      this.extractorFactory
    );
}
