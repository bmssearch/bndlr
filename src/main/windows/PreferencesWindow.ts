import { BridgeEventList } from "../../api/events";
import { BrowserWindow } from "electron";

declare const PREFERENCES_WINDOW_WEBPACK_ENTRY: any;
declare const PREFERENCES_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export class PreferencesWindow {
  private win: BrowserWindow | null = null;

  public show = () => {
    if (this.win && !this.win.isDestroyed()) {
      this.win.show();
      this.win.focus();
    } else {
      this.create();
    }
  };

  public close = () => {
    this.win?.destroy();
  };

  public send = <K extends keyof BridgeEventList>(
    channel: K,
    params: BridgeEventList[K]
  ) => {
    this.win?.webContents.send(channel, params);
  };

  private create = () => {
    this.win = new BrowserWindow({
      height: 440,
      width: 600,
      webPreferences: {
        preload: PREFERENCES_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
    });
    this.win.loadURL(PREFERENCES_WINDOW_WEBPACK_ENTRY);
  };
}
