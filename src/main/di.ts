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
import { AppTray } from "./windows/tray";
import AutoLaunch from "auto-launch";
import { BetterSqlBmsRepository } from "../core/repositories/BetterSqliteImpl/BmsRepository";
import { BetterSqliteBmsCheckRepository } from "../core/repositories/BetterSqliteImpl/BmsCheckRepository";
import { BetterSqliteGroupRepository } from "../core/repositories/BetterSqliteImpl/GroupRepository";
import { BetterSqliteInstallationRepository } from "../core/repositories/BetterSqliteImpl/InstallationRepository";
import { BetterSqliteObservationRepository } from "../core/repositories/BetterSqliteImpl/ObservationRepository";
import { BetterSqliteResourceRepository } from "../core/repositories/BetterSqliteImpl/ResourceRepository";
import { BmsRegistrar } from "../core/app/BmsRegistrar";
import { BndlrApp } from "./BndlrApp";
import { BridgeEventRelay } from "./BridgeEventRelay";
import { DatabaseConnector } from "../core/adapters/bettersqlite";
import { DeeplinkHandler } from "./DeeplinkHandler";
import { DownloaderFactory } from "../core/adapters/Downloader";
import { EventEmitterQueue } from "../core/adapters/Queue";
import { ExtractorFactory } from "../core/adapters/Extractor";
import { GroupRegistrar } from "../core/app/GroupRegistrar";
import { Installation } from "../core/models/Installation";
import { InstallationWorker } from "../core/workers/InstallationWorker";
import { MainWindow } from "./windows/MainWindow";
import { MockBmsManifestRepository } from "../core/repositories/BmsManifestRepository";
import { MockGroupManifestRepository } from "../core/repositories/GroupManifestRepository";
import { MockUpdatesManifestRepository } from "../core/repositories/UpdatesManifestRepository";
import { ObservationRegistrar } from "../core/app/ObservationRegistrar";
import { ObservationWorker } from "../core/workers/ObservationWorker";
import { PreferencesWindow } from "./windows/PreferencesWindow";
import { ResourceRegistrar } from "../core/app/ResourceRegistrar";
import { Service } from "../core/app/Service";
import { StorePreferencesRepository } from "../core/repositories/PreferencesRepository";
import { TemporaryDiskProviderFactory } from "../core/adapters/TemporaryDiskProvider";
import { app } from "electron";
import path from "path";

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
const deeplinkHandler = new DeeplinkHandler(appEventEmitter);
const relay = new BridgeEventRelay(appEventEmitter);

const appTray = new AppTray();
const mainWindow = new MainWindow(relay);
const preferencesWindow = new PreferencesWindow(relay);

const router = new AppEventRouter(
  appEventEmitter,
  service,
  relay,
  preferencesWindow
);

export const bndlrApp = new BndlrApp(
  preferencesRepository,
  dbc,
  autoLaunch,

  relay,
  appEventEmitter,
  router,
  deeplinkHandler,

  installationWorker,
  observationWorker,

  mainWindow,
  appTray
);
