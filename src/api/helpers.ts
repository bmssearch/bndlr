import { EventKey, EventList } from "./events";
import { IpcRendererEvent, ipcRenderer } from "electron";

export const send = <K extends EventKey>(key: K, params: EventList[K]) => {
  ipcRenderer.send(key, params);
};

export type Handler<K extends EventKey> = (
  event: IpcRendererEvent,
  params: EventList[K]
) => EventList[K];

export const listen = <K extends EventKey>(key: K, handler: Handler<K>) => {
  ipcRenderer.on(key, handler);
  return () => {
    ipcRenderer.removeListener(key, handler);
  };
};
