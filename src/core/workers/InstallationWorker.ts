import { Queue, QueueItem } from "../adapters/Queue";

import { DestinationNotFoundError } from "../app/ResourceInstaller/errors";
import { ExceedsMaximumSizeError } from "../adapters/Downloader/errors";
import { Installation } from "../models/Installation";
import { InstallationFolderNamer } from "../app/InstallationFolderNamer";
import { PreferencesRepository } from "../repositories/PreferencesRepository";
import { ResourceInstallerFactory } from "../app/ResourceInstaller";
import { ResourceInstallerProgress } from "../app/ResourceInstaller/types";
import log from "electron-log";

type Handler = (
  items: QueueItem<Installation, ResourceInstallerProgress>[]
) => void;

type FinishHandler = (installation: Installation) => void;
type FailHandler = (installation: Installation, message: string) => void;
type FatalHandler = (installation: Installation, message: string) => void;

export class InstallationWorker {
  private finishListeners: FinishHandler[] = [];
  private failListeners: FailHandler[] = [];
  private fatalListeners: FatalHandler[] = [];

  constructor(
    private preferenceRepository: PreferencesRepository,
    private queue: Queue<Installation, ResourceInstallerProgress>,
    private resourceInstallerFactory: ResourceInstallerFactory,
    private installationFolderNamer: InstallationFolderNamer
  ) {}

  public start = () => {
    this.queue.init(async (installation, onProgress, onFinish, onFatal) => {
      try {
        const resourceInstaller = this.resourceInstallerFactory.create();
        resourceInstaller.onProgress((progress) => {
          onProgress(progress);
        });

        const { installationDist } = await this.preferenceRepository.get();
        await resourceInstaller.install(
          installation.resource.url,
          installationDist,
          this.installationFolderNamer.name(installation.resource.bms)
        );

        this.handleFinish(installation);
        onFinish();
      } catch (err) {
        log.error(err);

        if (err instanceof DestinationNotFoundError) {
          this.handleFatal(installation, err.message);
          onFatal();
        } else if (err instanceof ExceedsMaximumSizeError) {
          this.handleFail(installation, "ファイルサイズが大きすぎます。");
          onFinish();
        } else {
          this.handleFail(installation, err.message);
          onFinish();
        }
      }
    });
    this.queue.start();
  };

  public put = (installation: Installation) => {
    this.queue.put(installation);
  };

  public addFinishListener = (handler: FinishHandler) => {
    this.finishListeners.push(handler);
  };

  public addFailListener = (handler: FailHandler) => {
    this.failListeners.push(handler);
  };

  public addFatalListener = (handler: FatalHandler) => {
    this.fatalListeners.push(handler);
  };

  public addChangeListener = (handler: Handler) => {
    this.queue.addChangeListener((items) => {
      handler(items);
    });
  };

  private handleFinish = (installation: Installation) => {
    this.finishListeners.forEach((listener) => {
      listener(installation);
    });
  };

  private handleFail = (installation: Installation, message: string) => {
    this.failListeners.forEach((listener) => {
      listener(installation, message);
    });
  };

  private handleFatal = (installation: Installation, message: string) => {
    this.fatalListeners.forEach((listener) => {
      listener(installation, message);
    });
  };
}
