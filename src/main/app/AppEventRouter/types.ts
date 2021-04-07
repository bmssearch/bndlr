import { EventEmitter } from "events";
import { Installation } from "../../../core/models/Installation";
import { QueueItem } from "../../../core/adapters/Queue";
import { ResourceInstallerProgress } from "../../../core/adapters/ResourceInstaller";

export interface AppEventList {
  test: Record<string, never>;

  addBms: { manifestUrl: string };
  addGroup: { manifestUrl: string };
  checkUpdates: Record<string, never>;
  execInstallations: { installations: Installation[] };

  reloadInstallations: Record<string, never>;
  progressOnInstallations: {
    items: QueueItem<Installation, ResourceInstallerProgress>[];
  };
  finishInstallation: { installationId: number };
  failInstallation: { installationId: number };
}

export class AppEventEmitter extends EventEmitter {
  public on<K extends keyof AppEventList>(
    channel: K,
    listener: (params: AppEventList[K]) => void
  ): any;
  public on(channel: keyof AppEventList, listener: (...args: any[]) => void) {
    return super.on(channel, listener);
  }

  public emit<K extends keyof AppEventList>(
    channel: K,
    params: AppEventList[K]
  ): boolean;
  public emit(event: keyof AppEventList, ...args: any[]) {
    return super.emit(event, ...args);
  }
}
