import { IpcMainEvent, ipcMain } from "electron";

import { BridgeEventList } from "../../api/events";
import { EventEmitter } from "events";

export class RelayEventEmitter extends EventEmitter {
  // メソッド本体。元々のemitメソッドを踏襲している
  public emit(event: "event", channel: string, params: any) {
    return super.emit(event, channel, params);
  }
}

// overwriter for typings
export type IpcMainEventHandler<K extends keyof BridgeEventList> = (
  event: IpcMainEvent,
  params: BridgeEventList[K]
) => void;

export class IpcMainEventEmitter extends EventEmitter {
  public handle<K extends keyof BridgeEventList>(
    channel: K,
    handler: (event: IpcMainEvent, params: BridgeEventList[K]) => any
  ): any;
  public handle(
    channel: keyof BridgeEventList,
    handler: (...args: any[]) => any
  ) {
    return ipcMain.handle(channel, handler);
  }

  public on<K extends keyof BridgeEventList>(
    channel: K,
    handler: IpcMainEventHandler<K>
  ): any;
  public on(channel: keyof BridgeEventList, handler: (...args: any[]) => void) {
    return ipcMain.on(channel, handler);
  }

  public emit<K extends keyof BridgeEventList>(
    channel: K,
    params: BridgeEventList[K]
  ): boolean;
  public emit(event: keyof BridgeEventList, ...args: any[]) {
    return ipcMain.emit(event, ...args);
  }
}
