import { BridgeEventEmitter, RelayEventEmitter } from "./types";
import { Menu, dialog, ipcMain } from "electron";

import { AppEventEmitter } from "../AppEventRouter/types";
import { BridgeEventList } from "../../api/events";

export class BridgeEventRelay {
  private relayEventEmitter: RelayEventEmitter;

  constructor(
    private bridgeEventEmitter: BridgeEventEmitter,
    private appEventEmitter: AppEventEmitter
  ) {
    this.relayEventEmitter = new RelayEventEmitter();
  }

  public listen = () => {
    this.bridgeEventEmitter.on("test", () => {
      this.appEventEmitter.emit("test", {});
      console.log("テストだよ");
    });

    ipcMain.handle("selectDirectory", async () => {
      const res = await dialog.showOpenDialog({
        title: "保存先",
        properties: ["openDirectory", "createDirectory"],
      });
      if (res.filePaths.length === 0) return undefined;
      return res.filePaths[0];
    });

    this.bridgeEventEmitter.on("openMenu", () => {
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

    this.bridgeEventEmitter.on("fetchPreferences", () => {
      this.appEventEmitter.emit("reloadPreferences", {});
    });
    this.bridgeEventEmitter.on("setPreferences", (event, { preferences }) => {
      this.appEventEmitter.emit("setPreferences", { preferences });
    });
    this.bridgeEventEmitter.on("closePreferencesWindow", () => {
      this.appEventEmitter.emit("closePreferencesWindow", {});
    });

    this.bridgeEventEmitter.on(
      "requestAddBms",
      async (event, { manifestUrl }) => {
        this.appEventEmitter.emit("addBms", { manifestUrl });
      }
    );

    this.bridgeEventEmitter.on(
      "requestAddGroup",
      async (event, { manifestUrl }) => {
        this.appEventEmitter.emit("addGroup", { manifestUrl });
      }
    );

    this.bridgeEventEmitter.on("fetchInstallations", () => {
      this.appEventEmitter.emit("reloadInstallations", {});
    });
    this.bridgeEventEmitter.on(
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
