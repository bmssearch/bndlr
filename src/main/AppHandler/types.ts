import { EventEmitter } from "events";
import { Installation } from "../../core/models/Installation";
import { Preferences } from "../../core/models/Preference";
import { QueueItem } from "../../core/adapters/Queue";
import { ResourceInstallerProgress } from "../../core/app/ResourceInstaller/types";

export interface AppEventList {
  test: Record<string, never>;

  importBmsManifest: { manifestUrl: string; notifyEmptyResult?: boolean };
  importGroupManifest: { manifestUrl: string };
  checkUpdates: Record<string, never>;

  reloadPreferences: Record<string, never>;
  setPreferences: { preferences: Preferences };
  openPreferencesWindow: Record<string, never>;
  closePreferencesWindow: Record<string, never>;

  reloadInstallations: Record<string, never>;
  execInstallations: { installations: Installation[] };
  skipInstallations: { installations: Installation[] };

  progressOnInstallations: {
    items: QueueItem<Installation, ResourceInstallerProgress>[];
  };
  finishInstallation: { installationId: number };
  failInstallation: { installationId: number };

  quitApp: Record<string, never>;
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
