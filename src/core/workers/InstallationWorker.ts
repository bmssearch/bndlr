import { Queue, QueueItem } from "../adapters/Queue";
import {
  ResourceInstallerFactory,
  ResourceInstallerProgress,
} from "../adapters/ResourceInstaller";

import { Installation } from "../models/Installation";
import { PreferencesRepository } from "../repositories/PreferencesRepository";

type Handler = (
  items: QueueItem<Installation, ResourceInstallerProgress>[]
) => void;

type FinishHandler = (installationId: number) => void;
type ErrorHandler = (InstallationId: number) => void;

export class InstallationWorker {
  private finishListeners: FinishHandler[] = [];
  private errorListeners: FinishHandler[] = [];

  constructor(
    private preferenceRepository: PreferencesRepository,
    private queue: Queue<Installation, ResourceInstallerProgress>,
    private resourceInstallerFactory: ResourceInstallerFactory
  ) {}

  public start = () => {
    this.queue.init(async (entity, onProgress, onFinish) => {
      try {
        const resourceInstaller = this.resourceInstallerFactory.create();
        resourceInstaller.onProgress((progress) => {
          onProgress(progress);
        });

        const { installationDist } = await this.preferenceRepository.get();
        // distが無効だったら全部ダメなのでFATAL扱いにする
        await resourceInstaller.install(entity.resource.url, installationDist);
        this.finishListeners.forEach((listener) => {
          listener(entity.id);
        });
      } catch (err) {
        this.errorListeners.forEach((listener) => {
          listener(entity.id);
        });
      } finally {
        onFinish();
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

  public addErrorListener = (handler: ErrorHandler) => {
    this.errorListeners.push(handler);
  };

  public addChangeListener = (handler: Handler) => {
    this.queue.addChangeListener((items) => {
      handler(items);
    });
  };
}
