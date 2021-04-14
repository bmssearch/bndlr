import { Tray } from "electron";
import path from "path";

const icons = {
  default:
    process.platform === "win32"
      ? path.join(__dirname, "assets/tray_icon_win_white.ico")
      : path.join(__dirname, "assets/tray_icon_osx_black.png"),
  active:
    process.platform === "win32"
      ? path.join(__dirname, "assets/tray_icon_win_white_active.ico")
      : path.join(__dirname, "assets/tray_icon_osx_black.png"),
};

export class AppTray {
  public tray: Tray | null = null;

  public show = () => {
    this.tray = new Tray(icons.default);
    this.tray.setTitle("bndlr");
    this.tray.setToolTip("bndlr");
  };

  public setActive = () => {
    this.tray?.setImage(icons.active);
  };

  public setInactive = () => {
    this.tray?.setImage(icons.default);
  };

  public destroy = () => {
    this.tray?.destroy();
  };
}
