import Router from "url-router";
import { app } from "electron";
import isDev from "electron-is-dev";
import { onAppReady } from "./app";
import path from "path";

if (require("electron-squirrel-startup")) {
  app.quit();
}

require("update-electron-app")();

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  console.log("CANNOT GET THE LOCK");
  app.quit();
} else {
  app.removeAsDefaultProtocolClient("bndlr");

  if (isDev && process.platform === "win32") {
    app.setAsDefaultProtocolClient("bndlr", process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  } else {
    app.setAsDefaultProtocolClient("bndlr");
  }

  app.on("second-instance", (e, argv) => {
    const rawUrl = argv.find((arg) => arg.startsWith("bndlr://"));
    if (!rawUrl) return;
    const url = rawUrl.replace(/^bndlr:\/\//, "");
    type Handler = (params: Record<string, string>) => void;
    const router = new Router<Handler>();

    router.add("manifest/bms?url=:url(.*)", (params) => {
      console.log("will load manifest", params);
    });
    const res = router.find(url);
    res?.handler(res.params);
  });

  app.on("ready", onAppReady);
}
