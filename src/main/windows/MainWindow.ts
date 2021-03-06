import { BridgeEventList } from "../../api/events";
import { BrowserWindow } from "electron";

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export class MainWindow {
  public win: BrowserWindow | null = null;

  public show = () => {
    if (this.win && !this.win.isDestroyed()) {
      this.win.show();
      this.win.focus();
    } else {
      this.create();
      this.win?.show();
    }
  };

  public send = <K extends keyof BridgeEventList>(
    channel: K,
    params: BridgeEventList[K]
  ) => {
    if (this.win && !this.win.isDestroyed()) {
      this.win.webContents.send(channel, params);
    }
  };

  public create = () => {
    this.win = new BrowserWindow({
      height: 600,
      width: 400,
      skipTaskbar: true,
      frame: false,
      webPreferences: {
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
      show: false,
    });
    this.win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    this.win.on("blur", () => {
      this.win?.hide();
    });
  };
}
