import { Menu, dialog } from "electron";

import { AppEventEmitter } from "../AppHandler/types";
import { BridgeEventList } from "../../api/events";
import { IpcMainEventEmitter } from "./types";
import { MainWindow } from "../windows/MainWindow";
import { PreferencesWindow } from "../windows/PreferencesWindow";

export class BridgeEventRelay {
  private ipcMainEmitter: IpcMainEventEmitter;

  constructor(
    private appEventEmitter: AppEventEmitter,
    private mainWindow: MainWindow,
    private preferencesWindow: PreferencesWindow
  ) {
    this.ipcMainEmitter = new IpcMainEventEmitter();
  }

  public listen = () => {
    this.ipcMainEmitter.on("test", () => {
      this.appEventEmitter.emit("test", {});
      console.log("TESTING");
    });

    this.ipcMainEmitter.handle("selectDirectory", async () => {
      const res = await dialog.showOpenDialog({
        title: "保存先",
        properties: ["openDirectory", "createDirectory"],
      });
      if (res.filePaths.length === 0) return undefined;
      return res.filePaths[0];
    });

    this.ipcMainEmitter.on("openMenu", () => {
      const menu = Menu.buildFromTemplate([
        {
          label: "設定",
          click: () => {
            this.appEventEmitter.emit("openPreferencesWindow", {});
          },
        },
        {
          label: "更新チェック",
          click: () => {
            this.appEventEmitter.emit("checkUpdates", {});
          },
        },
        { type: "separator" },
        {
          label: "終了",
          click: () => {
            this.appEventEmitter.emit("quitApp", {});
          },
        },
      ]);
      menu.popup();
    });

    this.ipcMainEmitter.on("fetchPreferences", () => {
      this.appEventEmitter.emit("reloadPreferences", {});
    });
    this.ipcMainEmitter.on("setPreferences", (event, { preferences }) => {
      this.appEventEmitter.emit("setPreferences", { preferences });
    });
    this.ipcMainEmitter.on("closePreferencesWindow", () => {
      this.appEventEmitter.emit("closePreferencesWindow", {});
    });

    this.ipcMainEmitter.on("requestAddBms", async (event, { manifestUrl }) => {
      this.appEventEmitter.emit("importBmsManifest", {
        manifestUrl,
        notifyEmptyResult: true,
      });
    });

    this.ipcMainEmitter.on(
      "requestAddGroup",
      async (event, { manifestUrl }) => {
        this.appEventEmitter.emit("importGroupManifest", { manifestUrl });
      }
    );

    this.ipcMainEmitter.on("fetchInstallations", () => {
      this.appEventEmitter.emit("reloadInstallations", {});
    });

    this.ipcMainEmitter.on(
      "acceptProposedInstallations",
      async (event, { installations }) => {
        this.appEventEmitter.emit("execInstallations", { installations });
        this.mainWindow.show();
      }
    );

    this.ipcMainEmitter.on(
      "skipProposedInstallations",
      async (event, { installations }) => {
        this.appEventEmitter.emit("skipInstallations", { installations });
      }
    );
  };

  public deliver = <K extends keyof BridgeEventList>(
    channel: K,
    params: BridgeEventList[K]
  ) => {
    this.mainWindow.send(channel, params);
    this.preferencesWindow.send(channel, params);
  };
}
