import { EventKey, EventList } from "../../../api/events";
import { IpcMainEvent, ipcMain } from "electron";

export type AppEventHandler<K extends EventKey> = (
  event: IpcMainEvent,
  params: EventList[K]
) => void;

export const on = <K extends EventKey>(key: K, handler: AppEventHandler<K>) => {
  ipcMain.on(key, handler);
};

export const reply = (event: IpcMainEvent) => <K extends EventKey>(
  key: K,
  params: EventList[K]
) => {
  event.reply(key, params);
};
