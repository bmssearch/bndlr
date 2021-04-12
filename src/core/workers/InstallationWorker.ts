import { Queue, QueueItem } from "../adapters/Queue";

import { DestinationNotFoundError } from "../app/ResourceInstaller/errors";
import { ExceedsMaximumSizeError } from "../adapters/Downloader/errors";
import { Installation } from "../models/Installation";
import { PreferencesRepository } from "../repositories/PreferencesRepository";
import { ResourceInstallerFactory } from "../app/ResourceInstaller";
import { ResourceInstallerProgress } from "../app/ResourceInstaller/types";
import log from "electron-log";

type Handler = (
  items: QueueItem<Installation, ResourceInstallerProgress>[]
) => void;

type FinishHandler = (installationId: number) => void;
type FailHandler = (InstallationId: number) => void;
type FatalHandler = (message: string) => void;

export class InstallationWorker {
  private finishListeners: FinishHandler[] = [];
  private failListeners: FinishHandler[] = [];
  private fatalListeners: FatalHandler[] = [];

  constructor(
    private preferenceRepository: PreferencesRepository,
    private queue: Queue<Installation, ResourceInstallerProgress>,
    private resourceInstallerFactory: ResourceInstallerFactory
  ) {}

  public start = () => {
    this.queue.init(async (entity, onProgress, onFinish, onFatal) => {
      try {
        const resourceInstaller = this.resourceInstallerFactory.create();
        resourceInstaller.onProgress((progress) => {
          onProgress(progress);
        });

        const { installationDist } = await this.preferenceRepository.get();
        await resourceInstaller.install(entity.resource.url, installationDist);

        this.handleFinish(entity.id);
        onFinish();
      } catch (err) {
        log.error(err);

        if (err instanceof DestinationNotFoundError) {
          this.handleFatal(err.message);
          onFatal();
        } else if (err instanceof ExceedsMaximumSizeError) {
          this.handleFail(entity.id);
          onFinish();
        } else {
          this.handleFail(entity.id);
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

  private handleFinish = (id: number) => {
    this.finishListeners.forEach((listener) => {
      listener(id);
    });
  };

  private handleFail = (id: number) => {
    this.failListeners.forEach((listener) => {
      listener(id);
    });
  };

  private handleFatal = (message: string) => {
    this.fatalListeners.forEach((listener) => {
      listener(message);
    });
  };
}
