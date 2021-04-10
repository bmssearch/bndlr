import { BridgeEventList } from "../../api/events";
import { BridgeEventRelay } from "../BridgeEventRelay";
import { BrowserWindow } from "electron";

declare const PREFERENCES_WINDOW_WEBPACK_ENTRY: any;
declare const PREFERENCES_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export const createPreferencesWindow = (relay: BridgeEventRelay) => {
  const preferencesWindow = new BrowserWindow({
    height: 440,
    width: 600,
    webPreferences: {
      preload: PREFERENCES_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });
  preferencesWindow.loadURL(PREFERENCES_WINDOW_WEBPACK_ENTRY);

  const handler = <K extends keyof BridgeEventList>(
    channel: K,
    params: BridgeEventList[K]
  ) => {
    preferencesWindow.webContents.send(channel, params);
  };
  relay.onEvent(handler);
  preferencesWindow.on("closed", () => {
    relay.removeListener(handler);
  });

  return preferencesWindow;
};
