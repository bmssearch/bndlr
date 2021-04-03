import { EventEmitter } from "events";
import { Resource } from "../../../core/models/Resource";

export interface AppEventList {
  test: Record<string, never>;

  addBms: { specUrl: string };
  installResources: { resources: Resource[] };

  reloadInstallationProposals: Record<string, never>;
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
