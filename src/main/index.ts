import AutoLaunch from "auto-launch";
import { app } from "electron";
import { onAppReady } from "./onReady";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const launcher = new AutoLaunch({ name: "bndlr" });

launcher.isEnabled().then((enabled) => {
  console.log("enabled:", enabled);
});

app.on("ready", onAppReady);
