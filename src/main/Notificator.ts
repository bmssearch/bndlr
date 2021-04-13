import { MainWindow } from "./windows/MainWindow";
import { Notification } from "electron";

export class Notificator {
  constructor(private mainWindow: MainWindow) {}

  public show = (title: string, body?: string) => {
    const notification = new Notification({ title, body });
    notification.on("click", () => {
      this.mainWindow.show();
    });
    notification.show();
  };
}
