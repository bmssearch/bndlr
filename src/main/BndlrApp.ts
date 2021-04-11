import { AppEventEmitter } from "./AppEventRouter/types";
import { AppEventRouter } from "./AppEventRouter";
import { AppTray } from "./windows/tray";
import AutoLaunch from "auto-launch";
import { BridgeEventRelay } from "./BridgeEventRelay";
import { DatabaseConnector } from "../core/adapters/bettersqlite";
import { DeeplinkHandler } from "./DeeplinkHandler";
import { InstallationWorker } from "../core/workers/InstallationWorker";
import { MainWindow } from "./windows/MainWindow";
import { ObservationWorker } from "../core/workers/ObservationWorker";
import { PreferencesRepository } from "../core/repositories/PreferencesRepository";
import { app } from "electron";
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
    private router: AppEventRouter,
    private deeplinkHandler: DeeplinkHandler,

    // core
    private installationWorker: InstallationWorker,
    private observationWorker: ObservationWorker,

    // windows
    private mainWindow: MainWindow,
    private appTray: AppTray
  ) {}

  public run = async () => {
    console.log("BUNDLR APP RUNNING");

    this.dbc.initialize();

    const { launchOnStartup } = await this.preferencesRepository.get();
    setAutoLaunch(this.autoLaunch, launchOnStartup);

    this.relay.listen();
    this.router.listen();

    this.installationWorker.addChangeListener((items) => {
      this.appEventEmitter.emit("progressOnInstallations", { items });
    });
    this.installationWorker.addFinishListener((installationId) => {
      this.appEventEmitter.emit("finishInstallation", { installationId });
    });
    this.installationWorker.addErrorListener((installationId) => {
      this.appEventEmitter.emit("failInstallation", { installationId });
    });
    this.installationWorker.start();

    this.observationWorker.addDetectUpdateListener(() => {
      this.appEventEmitter.emit("checkUpdates", {});
    });
    this.observationWorker.start();

    this.appTray.show();
    this.mainWindow.show();

    trayWindow.setOptions({
      tray: this.appTray.tray,
      window: this.mainWindow.win,
    });
    trayWindow.setWindowSize({ margin_x: 10, margin_y: 10 });

    // Menu.setApplicationMenu(null);

    app.on("second-instance", (e, argv) => {
      console.log("DEEPLINKING");
      const rawUrl = argv.find((arg) => arg.startsWith("bndlr://"));
      if (!rawUrl) return;
      this.deeplinkHandler.handle(rawUrl);
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
