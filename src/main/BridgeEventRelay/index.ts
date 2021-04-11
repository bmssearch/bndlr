import { IpcMainEventEmitter, RelayEventEmitter } from "./types";
import { Menu, dialog } from "electron";

import { AppEventEmitter } from "../AppEventRouter/types";
import { BridgeEventList } from "../../api/events";

export class BridgeEventRelay {
  private relayEventEmitter: RelayEventEmitter;
  private ipcMainEmitter: IpcMainEventEmitter;

  constructor(private appEventEmitter: AppEventEmitter) {
    this.relayEventEmitter = new RelayEventEmitter();
    this.ipcMainEmitter = new IpcMainEventEmitter();
  }

  public listen = () => {
    this.ipcMainEmitter.on("test", () => {
      this.appEventEmitter.emit("test", {});
      console.log("テストだよ");
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
      this.appEventEmitter.emit("addBms", { manifestUrl });
    });

    this.ipcMainEmitter.on(
      "requestAddGroup",
      async (event, { manifestUrl }) => {
        this.appEventEmitter.emit("addGroup", { manifestUrl });
      }
    );

    this.ipcMainEmitter.on("fetchInstallations", () => {
      this.appEventEmitter.emit("reloadInstallations", {});
    });
    this.ipcMainEmitter.on(
      "acceptProposedInstallations",
      async (event, { installations }) => {
        this.appEventEmitter.emit("execInstallations", { installations });
      }
    );
  };

  public onEvent = <K extends keyof BridgeEventList>(
    handler: (channel: K, params: BridgeEventList[K]) => void
  ) => {
    this.relayEventEmitter.on("event", handler);
  };
  public removeListener = <K extends keyof BridgeEventList>(
    handler: (channel: K, params: BridgeEventList[K]) => void
  ) => {
    this.relayEventEmitter.removeListener("event", handler);
  };
  public deliver = <K extends keyof BridgeEventList>(
    channel: K,
    params: BridgeEventList[K]
  ) => {
    this.relayEventEmitter.emit("event", channel, params);
  };
}
