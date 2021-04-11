import { BrowserWindow, app, ipcMain } from "electron";
import {
  ResourceInstallerFactory,
  ResourceInstallerProgress,
} from "../core/adapters/ResourceInstaller";
import {
  mockBmsManifest,
  mockGroupManifest,
  mockUpdatesManifest,
} from "../__mock__/mocks";

import { AppEventEmitter } from "./AppEventRouter/types";
import { AppEventRouter } from "./AppEventRouter";
import AutoLaunch from "auto-launch";
import { BetterSqlBmsRepository } from "../core/repositories/BetterSqliteImpl/BmsRepository";
import { BetterSqliteBmsCheckRepository } from "../core/repositories/BetterSqliteImpl/BmsCheckRepository";
import { BetterSqliteGroupRepository } from "../core/repositories/BetterSqliteImpl/GroupRepository";
import { BetterSqliteInstallationRepository } from "../core/repositories/BetterSqliteImpl/InstallationRepository";
import { BetterSqliteObservationRepository } from "../core/repositories/BetterSqliteImpl/ObservationRepository";
import { BetterSqliteResourceRepository } from "../core/repositories/BetterSqliteImpl/ResourceRepository";
import { BmsRegistrar } from "../core/app/BmsRegistrar";
import { BridgeEventRelay } from "./BridgeEventRelay";
import { DatabaseConnector } from "../core/adapters/bettersqlite";
import { DownloaderFactory } from "../core/adapters/Downloader";
import { EventEmitterQueue } from "../core/adapters/Queue";
import { ExtractorFactory } from "../core/adapters/Extractor";
import { GroupRegistrar } from "../core/app/GroupRegistrar";
import { Installation } from "../core/models/Installation";
import { InstallationWorker } from "../core/workers/InstallationWorker";
import { MockBmsManifestRepository } from "../core/repositories/BmsManifestRepository";
import { MockGroupManifestRepository } from "../core/repositories/GroupManifestRepository";
import { MockUpdatesManifestRepository } from "../core/repositories/UpdatesManifestRepository";
import { ObservationRegistrar } from "../core/app/ObservationRegistrar";
import { ObservationWorker } from "../core/workers/ObservationWorker";
import { ResourceRegistrar } from "../core/app/ResourceRegistrar";
import { Service } from "../core/app/Service";
import { StorePreferencesRepository } from "../core/repositories/PreferencesRepository";
import { TemporaryDiskProviderFactory } from "../core/adapters/TemporaryDiskProvider";
import { createMainWindow } from "./windows/main";
import path from "path";
import { setTray } from "./windows/tray";
//@ts-ignore
import trayWindow from "electron-tray-window";

const dbc = new DatabaseConnector();

const autoLaunch = new AutoLaunch({ name: "bndlr" });
const preferencesRepository = new StorePreferencesRepository();

const bmsManifestRepository = new MockBmsManifestRepository(mockBmsManifest);
const groupManifestRepository = new MockGroupManifestRepository(
  mockGroupManifest
);
const updatesManifestRepository = new MockUpdatesManifestRepository(
  mockUpdatesManifest
);

const bmsRepository = new BetterSqlBmsRepository(dbc);
const bmsCheckRepository = new BetterSqliteBmsCheckRepository(dbc);
const groupRepository = new BetterSqliteGroupRepository(dbc);
const observationRepository = new BetterSqliteObservationRepository(dbc);
const resourceRepoisotry = new BetterSqliteResourceRepository(dbc);
const installationRepository = new BetterSqliteInstallationRepository(dbc);

const bmsRegistrar = new BmsRegistrar(
  bmsManifestRepository,
  bmsRepository,
  bmsCheckRepository
);
const groupRegistrar = new GroupRegistrar(
  groupManifestRepository,
  groupRepository
);
const resourceRegistrar = new ResourceRegistrar(
  preferencesRepository,
  resourceRepoisotry,
  installationRepository
);
const observationRegistrar = new ObservationRegistrar(observationRepository);

const tpdFactory = new TemporaryDiskProviderFactory(
  path.join(app.getPath("userData"), "temp")
);
const downloaderFactory = new DownloaderFactory();
const extractorFactory = new ExtractorFactory();
const resourceInstallerFactory = new ResourceInstallerFactory(
  tpdFactory,
  downloaderFactory,
  extractorFactory
);

let mainWindow: BrowserWindow;
let preferencesWindow: BrowserWindow;

export const onAppReady = async () => {
  dbc.initialize();

  const { launchOnStartup } = await preferencesRepository.get();
  const autoLaunchEnabled = await autoLaunch.isEnabled();
  if (launchOnStartup) {
    if (!autoLaunchEnabled) {
      autoLaunch.enable();
    }
  } else {
    if (autoLaunchEnabled) {
      autoLaunch.disable();
    }
  }

  const installationQueue = new EventEmitterQueue<
    Installation,
    ResourceInstallerProgress
  >();
  const installationWorker = new InstallationWorker(
    preferencesRepository,
    installationQueue,
    resourceInstallerFactory
  );

  const observationWorker = new ObservationWorker(
    preferencesRepository,
    observationRepository
  );

  const service = new Service(
    preferencesRepository,
    autoLaunch,

    installationWorker,

    bmsManifestRepository,
    groupManifestRepository,
    updatesManifestRepository,

    bmsRepository,
    bmsCheckRepository,
    groupRepository,
    observationRepository,
    resourceRepoisotry,
    installationRepository,

    bmsRegistrar,
    groupRegistrar,
    observationRegistrar,
    resourceRegistrar
  );

  const appEventEmitter = new AppEventEmitter();
  const rendererEventEmitter = ipcMain;

  const relay = new BridgeEventRelay(rendererEventEmitter, appEventEmitter);
  relay.listen();

  const router = new AppEventRouter(
    appEventEmitter,
    service,
    relay,
    preferencesWindow
  );
  router.listen();

  installationWorker.addChangeListener((items) => {
    appEventEmitter.emit("progressOnInstallations", { items });
  });
  installationWorker.addFinishListener((installationId) => {
    appEventEmitter.emit("finishInstallation", { installationId });
  });
  installationWorker.addErrorListener((installationId) => {
    appEventEmitter.emit("failInstallation", { installationId });
  });
  installationWorker.start();

  observationWorker.addDetectUpdateListener(() => {
    appEventEmitter.emit("checkUpdates", {});
  });
  observationWorker.start();

  const tray = setTray();
  mainWindow = createMainWindow(relay);
  mainWindow.on("blur", () => {
    mainWindow.hide();
  });

  trayWindow.setOptions({ tray, window: mainWindow });
  trayWindow.setWindowSize({ margin_x: 10, margin_y: 10 });

  // Menu.setApplicationMenu(null);

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      // tray.destroy();
      app.quit();
    }
  });
};
