import { Tray } from "electron";
import path from "path";

export class AppTray {
  public tray: Tray | null = null;

  public show = () => {
    this.tray = new Tray(path.join(__dirname, "assets/icon.png"));
    this.tray.setTitle("bndlr");
    this.tray.setToolTip("bndlr");
  };

  public destroy = () => {
    this.tray?.destroy();
  };
}
