import { Menu, app, dialog } from "electron";

import { AppEventEmitter } from "./AppHandler/types";
import { AppHandler } from "./AppHandler";
import { AppTray } from "./windows/AppTray";
import AutoLaunch from "auto-launch";
import { BridgeEventRelay } from "./BridgeEventRelay";
import { DatabaseConnector } from "../core/adapters/bettersqlite";
import { DeeplinkHandler } from "./DeeplinkHandler";
import { InstallationWorker } from "../core/workers/InstallationWorker";
import { MainWindow } from "./windows/MainWindow";
import { Notificator } from "./Notificator";
import { ObservationWorker } from "../core/workers/ObservationWorker";
import { PreferencesRepository } from "../core/repositories/PreferencesRepository";
import { PreferencesWindow } from "./windows/PreferencesWindow";
import { Service } from "../core/app/Service";
import { setAutoLaunch } from "./settings";
//@ts-ignore
import trayWindow from "electron-tray-window";

export class BndlrApp {
  constructor(
    // infra
    private preferencesRepository: PreferencesRepository,
    private dbc: DatabaseConnector,
    private autoLaunch: AutoLaunch,

    // handlers
    private relay: BridgeEventRelay,
    private appEventEmitter: AppEventEmitter,
    private handler: AppHandler,
    private deeplinkHandler: DeeplinkHandler,
    private notificator: Notificator,

    // core
    private installationWorker: InstallationWorker,
    private observationWorker: ObservationWorker,
    private service: Service,

    // windows
    private mainWindow: MainWindow,
    private preferencesWindow: PreferencesWindow,
    private appTray: AppTray
  ) {}

  public run = async () => {
    console.log("BUNDLR APP RUNNING");

    await this.dbc.initialize();

    const { launchOnStartup } = await this.preferencesRepository.get();
    setAutoLaunch(this.autoLaunch, launchOnStartup);

    this.service.addErrorLister((title, err) => {
      this.notificator.show(title, err.message);
    });

    this.relay.listen();
    this.handler.listen();

    this.installationWorker.addChangeListener((items) => {
      this.appEventEmitter.emit("progressOnInstallations", { items });
    });
    this.installationWorker.addFinishListener((installation) => {
      this.notificator.show(
        "インストールが完了しました",
        `${installation.resource.bms.title} - ${installation.resource.name}`
      );
      this.appEventEmitter.emit("finishInstallation", {
        installationId: installation.id,
      });
    });
    this.installationWorker.addFailListener((installation, message) => {
      this.notificator.show(
        "インストールが失敗しました",
        `${installation.resource.bms.title} - ${installation.resource.name}\n\n${message}`
      );
      this.appEventEmitter.emit("failInstallation", {
        installationId: installation.id,
      });
    });
    this.installationWorker.addFatalListener((installation, message) => {
      if (this.mainWindow.win) {
        dialog.showMessageBox(this.mainWindow.win, { message });
      }
    });
    this.installationWorker.start();

    this.observationWorker.addDetectUpdateListener(() => {
      this.appEventEmitter.emit("checkUpdates", {});
    });
    this.observationWorker.start();

    this.appTray.show();
    this.mainWindow.create();

    trayWindow.setOptions({
      tray: this.appTray.tray,
      window: this.mainWindow.win,
    });
    trayWindow.setWindowSize({ margin_x: 10, margin_y: 10 });

    this.mainWindow.show();

    Menu.setApplicationMenu(null);

    app.on("second-instance", (e, argv) => {
      console.log("DEEPLINKING");
      this.mainWindow.show();
      const rawUrl = argv.find((arg) => arg.startsWith("bndlr://"));
      if (!rawUrl) return;

      // workaround: notifications are not shown immediately after launching a second instance
      setTimeout(() => {
        this.deeplinkHandler.handle(rawUrl);
      }, 200);
    });

    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        this.appTray.destroy();
        app.quit();
      }
    });

    app.on("quit", () => {
      this.dbc.close();
    });
  };
}
