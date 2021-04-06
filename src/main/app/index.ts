import { BrowserWindow, app, ipcMain } from "electron";
import {
  ResourceInstallerFactory,
  ResourceInstallerProgress,
} from "../../core/adapters/ResourceInstaller";
import {
  mockBmsSpec,
  mockGroupManifest,
  mockUpdatesManifest,
} from "../../__mock__/mocks";

import { AppEventEmitter } from "./AppEventRouter/types";
import { AppEventRouter } from "./AppEventRouter";
import { BridgeEventRelay } from "./BridgeEventRelay";
import { DownloaderFactory } from "../../core/adapters/Downloader";
import { EventEmitterQueue } from "../../core/adapters/Queue";
import { ExtractorFactory } from "../../core/adapters/Extractor";
import { Installation } from "../../core/models/Installation";
import { InstallationWorker } from "../../core/workers/InstallationWorker";
import { LocalDbBmsRepository } from "../../core/repositories/BmsRepository";
import { LocalDbGroupRepository } from "../../core/repositories/GroupRepository";
import { LocalDbInstallationRepository } from "../../core/repositories/InstallationRepository";
import { LocalDbObservationRepository } from "../../core/repositories/ObservationRepository";
import { LocalDbResourceRepository } from "../../core/repositories/ResourceRepository";
import { MockBmsSpecRepository } from "../../core/repositories/BmsSpecRepository";
import { MockGroupManifestRepository } from "../../core/repositories/GroupManifestRepository";
import { MockUpdatesManifestRepository } from "../../core/repositories/UpdatesManifestRepository";
import { Service } from "../../core/app/Service";
import { TemporaryDiskProviderFactory } from "../../core/adapters/TemporaryDiskProvider";
import { createMainWindow } from "../windows/main";
import { initialize } from "./initialize";
import { setTray } from "../windows/tray";

const bmsSpecRepository = new MockBmsSpecRepository(mockBmsSpec);
const groupManifestRepository = new MockGroupManifestRepository(
  mockGroupManifest
);
const updatesManifestRepository = new MockUpdatesManifestRepository(
  mockUpdatesManifest
);

const bmsRepository = new LocalDbBmsRepository();
const groupRepository = new LocalDbGroupRepository();
const observationRepository = new LocalDbObservationRepository();
const resourceRepoisotry = new LocalDbResourceRepository();
const installationRepository = new LocalDbInstallationRepository();

const tpdFactory = new TemporaryDiskProviderFactory();
const downloaderFactory = new DownloaderFactory();
const extractorFactory = new ExtractorFactory();
const resourceInstallerFactory = new ResourceInstallerFactory(
  tpdFactory,
  downloaderFactory,
  extractorFactory
);

export const onAppReady = async () => {
  await initialize();

  const installationQueue = new EventEmitterQueue<
    Installation,
    ResourceInstallerProgress
  >();
  const installationWorker = new InstallationWorker(
    installationQueue,
    resourceInstallerFactory
  );

  const service = new Service(
    installationWorker,

    bmsSpecRepository,
    groupManifestRepository,
    updatesManifestRepository,

    bmsRepository,
    groupRepository,
    observationRepository,
    resourceRepoisotry,
    installationRepository
  );

  const appEventEmitter = new AppEventEmitter();
  const rendererEventEmitter = ipcMain;

  const relay = new BridgeEventRelay(rendererEventEmitter, appEventEmitter);
  relay.listen();

  const router = new AppEventRouter(appEventEmitter, service, relay);
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

  setTray();
  createMainWindow(relay);

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow(relay);
    }
  });
};
