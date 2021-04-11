import AutoLaunch from "auto-launch";
import { app } from "electron";
import isDev from "electron-is-dev";
import path from "path";

export const setDefaultProtocol = () => {
  app.removeAsDefaultProtocolClient("bndlr");

  if (isDev && process.platform === "win32") {
    app.setAsDefaultProtocolClient("bndlr", process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  } else {
    app.setAsDefaultProtocolClient("bndlr");
  }
};

export const setAutoLaunch = async (
  autoLaunch: AutoLaunch,
  launchOnStartup: boolean
) => {
  const autoLaunchEnabled = await autoLaunch.isEnabled();
  if (launchOnStartup) {
    if (!autoLaunchEnabled) {
      autoLaunch.enable();
    }
  } else {
    if (autoLaunchEnabled) {
      autoLaunch.disable();
    }
  }
};
