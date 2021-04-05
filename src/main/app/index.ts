import { BrowserWindow, app, ipcMain } from "electron";
import {
  ResourceInstallerFactory,
  ResourceInstallerProgress,
} from "../../core/adapters/ResourceInstaller";

import { AppEventEmitter } from "./AppEventRouter/types";
import { AppEventRouter } from "./AppEventRouter";
import { AppHandler } from "../../core/app/AppHandler";
import { BridgeEventRelay } from "./BridgeEventRelay";
import { DownloaderFactory } from "../../core/adapters/Downloader";
import { EventEmitterQueue } from "../../core/adapters/Queue";
import { ExtractorFactory } from "../../core/adapters/Extractor";
import { Installation } from "../../core/models/Installation";
import { InstallationWorker } from "../../core/workers/InstallationWorker";
import { LocalDbBmsRepository } from "../../core/repositories/BmsRepository";
import { LocalDbInstallationRepository } from "../../core/repositories/InstallationRepository";
import { LocalDbObservationRepository } from "../../core/repositories/ObservationRepository";
import { LocalDbResourceRepository } from "../../core/repositories/ResourceRepository";
import { MockBmsSpecRepository } from "../../core/repositories/BmsSpecRepository";
import { TemporaryDiskProviderFactory } from "../../core/adapters/TemporaryDiskProvider";
import { createMainWindow } from "../windows/main";
import { initialize } from "./initialize";
import { mockBmsSpec } from "../../__mock__/mocks";
import { setTray } from "../windows/tray";

const bmsSpecRepository = new MockBmsSpecRepository(mockBmsSpec);
const bmsRepository = new LocalDbBmsRepository();
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

  const handler = new AppHandler(
    installationWorker,

    bmsSpecRepository,

    bmsRepository,
    observationRepository,
    resourceRepoisotry,
    installationRepository
  );

  const appEventEmitter = new AppEventEmitter();
  const rendererEventEmitter = ipcMain;

  const relay = new BridgeEventRelay(rendererEventEmitter, appEventEmitter);
  relay.listen();

  const router = new AppEventRouter(appEventEmitter, handler, relay);
  router.listen();

  installationWorker.addChangeListener((items) => {
    appEventEmitter.emit("progressOnInstallations", { items });
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
