import { app } from "electron";
import { onAppReady } from "./onReady";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

app.on("ready", onAppReady);
