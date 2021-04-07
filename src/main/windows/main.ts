import { BridgeEventList } from "../../api/events";
import { BridgeEventRelay } from "../app/BridgeEventRelay";
import { BrowserWindow } from "electron";

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export const createMainWindow = (relay: BridgeEventRelay): void => {
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  const handler = <K extends keyof BridgeEventList>(
    channel: K,
    params: BridgeEventList[K]
  ) => {
    mainWindow.webContents.send(channel, params);
  };
  relay.onEvent(handler);
  mainWindow.on("closed", () => {
    relay.removeListener(handler);
  });

  mainWindow.webContents.openDevTools();
};
