import { BrowserWindow, app } from "electron";

import { AppEventDelivery } from "./events/AppEventDelivery";
import { AppEventListener } from "./events/AppEventListener";
import { ResourceInstallationWorker } from "../../core/workers/ResourceInstallationWorker";
import { createMainWindow } from "../windows/main";
import { initialize } from "./initialize";
import { setTray } from "../windows/tray";

export const onAppReady = async () => {
  await initialize();

  const appEventDelivery = new AppEventDelivery();

  const resourceInstallationWorker = new ResourceInstallationWorker();
  const resourceInstallationQueue = resourceInstallationWorker.start(() => {
    appEventDelivery.emit("test", {});
  });

  const appEventListener = new AppEventListener(resourceInstallationQueue);
  appEventListener.register();

  setTray();
  createMainWindow(appEventDelivery);

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow(appEventDelivery);
    }
  });
};
