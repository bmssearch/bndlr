import { app, dialog } from "electron";

import { bndlrApp } from "./di";
import log from "electron-log";
import { setDefaultProtocol } from "./settings";

if (require("electron-squirrel-startup")) {
  app.quit();
  process.exit(0);
}

process.on("uncaughtException", (err) => {
  log.error(err);
  dialog.showErrorBox(
    "そんなことある？という感じのエラーが発生しました",
    "報告いただけると嬉しいです。"
  );
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
    log.info("APP IS READY");

    bndlrApp.run().catch((err) => {
      log.error(err);
      dialog.showErrorBox(
        "アプリの初期化中にエラーが発生しました",
        "報告お願いします。"
      );
      app.quit();
    });
  });
}
