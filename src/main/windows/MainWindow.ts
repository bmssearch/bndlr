import { BridgeEventList } from "../../api/events";
import { BridgeEventRelay } from "../BridgeEventRelay";
import { BrowserWindow } from "electron";

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export class MainWindow {
  public win: BrowserWindow | null = null;

  constructor(private relay: BridgeEventRelay) {}

  public show = () => {
    if (this.win && !this.win.isDestroyed()) {
      this.win.show();
      this.win.focus();
    } else {
      this.create();
    }
  };

  private create = () => {
    this.win = new BrowserWindow({
      height: 600,
      width: 600,
      skipTaskbar: true,
      frame: false,
      webPreferences: {
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
    });
    this.win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    const handler = <K extends keyof BridgeEventList>(
      channel: K,
      params: BridgeEventList[K]
    ) => {
      this.win?.webContents.send(channel, params);
    };
    this.relay.onEvent(handler);
    this.win.on("closed", () => {
      this.relay.removeListener(handler);
    });
    this.win.on("blur", () => {
      this.win?.hide();
    });

    this.win.webContents.openDevTools();
  };
}
