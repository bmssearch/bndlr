import {
  DestinationNotFoundError,
  ManifestInvalidError,
  RequestError,
} from "../../core/models/errors";
import { app, dialog } from "electron";

import { AppEventEmitter } from "./types";
import { BridgeEventRelay } from "../BridgeEventRelay";
import { InstallationProgress } from "../../core/models/InstallationProgress";
import { Notificator } from "../Notificator";
import { PreferencesWindow } from "../windows/PreferencesWindow";
import { Service } from "../../core/app/Service";
import log from "electron-log";
import { throttle } from "throttle-debounce";

export class AppHandler {
  constructor(
    private emitter: AppEventEmitter,
    private service: Service,
    private relay: BridgeEventRelay,
    private preferencesWindow: PreferencesWindow,
    private notificator: Notificator
  ) {}

  public listen = () => {
    this.emitter.removeAllListeners();

    this.emitter.on(
      "importBmsManifest",
      async ({ manifestUrl, notifyEmptyResult }) => {
        try {
          const createdInstallations = await this.service.importBmsManifest(
            manifestUrl
          );

          if (createdInstallations.length === 0 && notifyEmptyResult) {
            this.notificator.show(
              "BMSマニフェストを読み込みました",
              "新しいインストール準備はありません。"
            );
          }
          if (createdInstallations.length > 0) {
            this.notificator.show(
              "BMSマニフェストを読み込みました",
              `${createdInstallations.length}件のインストール準備ができました。`
            );
          }

          this.emitter.emit("reloadInstallations", {});
        } catch (err) {
          if (err instanceof RequestError) {
            this.notificator.show(
              "ぎょぎょぎょBMSマニフェストを取得できませんでした",
              err.message
            );
          } else if (err instanceof ManifestInvalidError) {
            this.notificator.show(
              "BMSマニフェストの形式が正しくありません",
              err.message
            );
          } else {
            log.error(err);
            dialog.showErrorBox(
              "何このエラー",
              "こんなエラー起こるはずではなかった、、開発者に教えていただけると嬉しいです。\n\n" +
                (err as Error).message
            );
          }
        }
      }
    );

    this.emitter.on("importGroupManifest", async ({ manifestUrl }) => {
      try {
        const bmsManifestUrls = await this.service.importGroupManifest(
          manifestUrl
        );
        this.notificator.show("グループマニフェストを読み込みました");
        bmsManifestUrls.forEach((bmsManifestUrl) => {
          this.emitter.emit("importBmsManifest", {
            manifestUrl: bmsManifestUrl,
          });
        });
      } catch (err) {
        if (err instanceof RequestError) {
          this.notificator.show(
            "グループマニフェストを取得できませんでした",
            err.message
          );
        } else if (err instanceof ManifestInvalidError) {
          this.notificator.show(
            "グループマニフェストの形式が正しくありません",
            err.message
          );
        } else {
          log.error(err);
          dialog.showErrorBox(
            "何このエラー",
            "こんなエラー起こるはずではなかった、、開発者に教えていただけると嬉しいです。\n\n" +
              (err as Error).message
          );
        }
      }
    });

    this.emitter.on("checkUpdates", async () => {
      try {
        const bmsManifestUrls = await this.service.checkUpdates();
        bmsManifestUrls.forEach((bmsManifestUrl) => {
          this.emitter.emit("importBmsManifest", {
            manifestUrl: bmsManifestUrl,
          });
        });
      } catch (err) {
        log.error(err);
        dialog.showErrorBox(
          "何このエラー",
          "こんなエラー起こるはずではなかった、、開発者に教えていただけると嬉しいです。\n\n" +
            (err as Error).message
        );
      }
    });

    this.emitter.on("execInstallations", ({ installations }) => {
      installations.forEach((installation) => {
        this.service.putInstallationIntoTaskQueue(installation);
      });
    });
    this.emitter.on("skipInstallations", async ({ installations }) => {
      await Promise.all(
        installations.map(async (installation) => {
          await this.service.skipInstallation(installation);
        })
      );
      this.emitter.emit("reloadInstallations", {});
    });

    this.emitter.on("reloadPreferences", async () => {
      const preferences = await this.service.fetchPreferences();
      this.relay.deliver("preferencesLoaded", { preferences });
    });
    this.emitter.on("setPreferences", async ({ preferences }) => {
      await this.service.setPreferences(preferences);
      this.relay.deliver("preferencesLoaded", { preferences });
    });
    this.emitter.on("openPreferencesWindow", () => {
      this.preferencesWindow.show();
    });
    this.emitter.on("closePreferencesWindow", async () => {
      this.preferencesWindow.close();
    });

    this.emitter.on("reloadInstallations", async () => {
      const installations = await this.service.fetchInstallations();
      this.relay.deliver("installationsLoaded", {
        installations,
      });
    });

    this.emitter.on(
      "progressOnInstallations",
      throttle(80, ({ items }) => {
        const installationProgresses = items.map((item) => {
          const installationId = item.entity.id;
          if (item.status === "queued") {
            return new InstallationProgress({
              installationId,
              progress: { type: "queued" },
            });
          }
          switch (item.progress?.type) {
            case "connecting":
              return new InstallationProgress({
                installationId,
                progress: { type: "connecting" },
              });
            case "transferring":
              return new InstallationProgress({
                installationId,
                progress: {
                  type: "transferring",
                  transferedByte: item.progress.transferedByte,
                  totalByte: item.progress.totalByte,
                },
              });
            case "extracting":
              return new InstallationProgress({
                installationId,
                progress: { type: "extracting" },
              });
            case "copying":
              return new InstallationProgress({
                installationId,
                progress: { type: "copying" },
              });
            case "cleaning":
              return new InstallationProgress({
                installationId,
                progress: { type: "cleaning" },
              });
            default:
              return new InstallationProgress({ installationId });
          }
        });

        this.relay.deliver("installationProgressesLoaded", {
          installationProgresses,
        });
      })
    );

    this.emitter.on("finishInstallation", async ({ installationId }) => {
      await this.service.updateInstallationStatus(installationId, "installed");
      this.emitter.emit("reloadInstallations", {});
    });

    this.emitter.on("failInstallation", async ({ installationId }) => {
      await this.service.updateInstallationStatus(installationId, "failed");
      this.emitter.emit("reloadInstallations", {});
    });

    this.emitter.on("quitApp", () => {
      app.exit();
    });

    this.emitter.on("exportLr2CustomFolders", async () => {
      try {
        await this.service.exportLr2CustomFolders();
        this.notificator.show("LR2カスタムフォルダの出力が完了しました");
      } catch (err) {
        if (err instanceof DestinationNotFoundError) {
          dialog.showErrorBox(
            "LR2カスタムフォルダ出力先を設定してください",
            err.message
          );
        } else {
          dialog.showErrorBox(
            "カスタムフォルダの出力に失敗しました",
            (err as Error).message
          );
        }
      }
    });
  };
}
