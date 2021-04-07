import { BridgeEventList } from "../../../api/events";
import { EventEmitter } from "events";
import { IpcMainEvent } from "electron";

export class RelayEventEmitter extends EventEmitter {
  // メソッド本体。元々のemitメソッドを踏襲している
  public emit(event: "event", channel: string, params: any) {
    return super.emit(event, channel, params);
  }
}

export type BridgeEventHandler<K extends keyof BridgeEventList> = (
  event: IpcMainEvent,
  params: BridgeEventList[K]
) => void;

export class BridgeEventEmitter extends EventEmitter {
  public on<K extends keyof BridgeEventList>(
    channel: K,
    handler: BridgeEventHandler<K>
  ): any;
  public on(channel: keyof BridgeEventList, handler: (...args: any[]) => void) {
    return super.on(channel, handler);
  }

  public emit<K extends keyof BridgeEventList>(
    channel: K,
    params: BridgeEventList[K]
  ): boolean;
  public emit(event: keyof BridgeEventList, ...args: any[]) {
    return super.emit(event, ...args);
  }
}
