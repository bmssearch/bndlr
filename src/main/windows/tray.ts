import { Tray } from "electron";
import path from "path";
let tray: Tray | null = null;

export const setTray = () => {
  tray = new Tray(path.join(__dirname, "assets/icon.png"));
  tray.setTitle("bndlr");
  tray.setToolTip("bndlr");
  return tray;
};
