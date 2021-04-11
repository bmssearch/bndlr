import { app } from "electron";
import { bndlrApp } from "./di";
import log from "electron-log";
import { setDefaultProtocol } from "./settings";

if (require("electron-squirrel-startup")) {
  app.quit();
}

process.on("uncaughtException", (err) => {
  log.error(err);
  app.quit();
});

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  // 自動アップデート機能は入れているが、コード署名証明書が結構するので一旦無し。だれか買ってくれ。
  require("update-electron-app")({ logger: log });

  setDefaultProtocol();

  app.on("ready", () => {
    bndlrApp.run();
  });
}
