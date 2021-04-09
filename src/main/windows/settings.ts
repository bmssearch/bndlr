import { BridgeEventList } from "../../api/events";
import { BridgeEventRelay } from "../BridgeEventRelay";
import { BrowserWindow } from "electron";

declare const SETTINGS_WINDOW_WEBPACK_ENTRY: any;
declare const SETTINGS_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export const createSettingsWindow = (relay: BridgeEventRelay): void => {
  const settingsWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: SETTINGS_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });
  settingsWindow.loadURL(SETTINGS_WINDOW_WEBPACK_ENTRY);

  const handler = <K extends keyof BridgeEventList>(
    channel: K,
    params: BridgeEventList[K]
  ) => {
    settingsWindow.webContents.send(channel, params);
  };
  relay.onEvent(handler);
  settingsWindow.on("closed", () => {
    relay.removeListener(handler);
  });

  settingsWindow.webContents.openDevTools();
};
