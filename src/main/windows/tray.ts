import { Tray } from "electron";

let tray: Tray | null = null;

export const setTray = () => {
  tray = new Tray("./example.jpg");
  tray.setTitle("baskett");
  tray.setToolTip("baskett");
};
