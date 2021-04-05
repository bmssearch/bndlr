import { Queue, QueueItem } from "../adapters/Queue";
import {
  ResourceInstallerFactory,
  ResourceInstallerProgress,
} from "../adapters/ResourceInstaller";

import { Installation } from "../models/Installation";

const ROOT_DIR = "F:\\temporary\\BMS";

type Handler = (
  items: QueueItem<Installation, ResourceInstallerProgress>[]
) => void;

export class InstallationWorker {
  constructor(
    private queue: Queue<Installation, ResourceInstallerProgress>,
    private resourceInstallerFactory: ResourceInstallerFactory
  ) {}

  public start = () => {
    this.queue.init(async (entity, onProgress, onFinish) => {
      const resourceInstaller = this.resourceInstallerFactory.create();
      resourceInstaller.onProgress((progress) => {
        onProgress(progress);
      });
      await resourceInstaller.install(entity.resource.url, ROOT_DIR);
      onFinish();
    });
    this.queue.start();
  };

  public put = (installation: Installation) => {
    this.queue.put(installation);
  };

  public addChangeListener = (handler: Handler) => {
    this.queue.addChangeListener((items) => {
      handler(items);
    });
  };
}
