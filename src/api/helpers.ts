import { IpcRendererEvent, ipcRenderer } from "electron";

import { BridgeEventList } from "./events";

export const send = <K extends keyof BridgeEventList>(
  key: K,
  params: BridgeEventList[K]
) => {
  ipcRenderer.send(key, params);
};

export type Handler<K extends keyof BridgeEventList> = (
  event: IpcRendererEvent,
  params: BridgeEventList[K]
) => void;

export type Listener<K extends keyof BridgeEventList> = (
  handler: Handler<K>
) => () => void;

export const listen = <K extends keyof BridgeEventList>(
  key: K,
  handler: Handler<K>
) => {
  ipcRenderer.on(key, handler);
  return () => {
    ipcRenderer.removeListener(key, handler);
  };
};
