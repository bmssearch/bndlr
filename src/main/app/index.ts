import { BrowserWindow, app, ipcMain } from "electron";

import { AppEventRouter } from "./AppEventRouter";
import { AppHandler } from "../../core/app/AppHandler";
import { BridgeEventRelay } from "./BridgeEventRelay";
import { EventEmitter } from "events";
import { LocalDbBmsRepository } from "../../core/repositories/BmsRepository";
import { LocalDbInstallationHistoryRepository } from "../../core/repositories/InstallationHistoryRepository";
import { LocalDbInstallationProposalRepository } from "../../core/repositories/InstallationProposalRepository";
import { LocalDbObservationRepository } from "../../core/repositories/ObservationRepository";
import { LocalDbResourceRepository } from "../../core/repositories/ResourceRepository";
import { MockBmsSpecRepository } from "../../core/repositories/BmsSpecRepository";
import { ResourceInstallationWorker } from "../../core/workers/ResourceInstallationWorker";
import { createMainWindow } from "../windows/main";
import { initialize } from "./initialize";
import { mockBmsSpec } from "../../__mock__/mocks";
import { setTray } from "../windows/tray";

const bmsSpecRepository = new MockBmsSpecRepository(mockBmsSpec);
const bmsRepository = new LocalDbBmsRepository();
const observationRepository = new LocalDbObservationRepository();
const resourceRepoisotry = new LocalDbResourceRepository();
const installationProposalRepoisotry = new LocalDbInstallationProposalRepository();
const installationHistoryRepoisotry = new LocalDbInstallationHistoryRepository();

export const onAppReady = async () => {
  await initialize();

  const resourceInstallationWorker = new ResourceInstallationWorker();
  const resourceInstallationQueue = resourceInstallationWorker.start();

  const handler = new AppHandler(
    resourceInstallationQueue,

    bmsSpecRepository,

    bmsRepository,
    observationRepository,
    resourceRepoisotry,
    installationProposalRepoisotry,
    installationHistoryRepoisotry
  );

  const appEventEmitter = new EventEmitter();
  const rendererEventEmitter = ipcMain;

  const relay = new BridgeEventRelay(rendererEventEmitter, appEventEmitter);
  relay.listen();

  const router = new AppEventRouter(appEventEmitter, handler, relay);
  router.listen();

  resourceInstallationWorker.addChangeListener(() => {
    console.log("CHANGE");
  });

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
