import { Listener, listen, send } from "./helpers";

import { Installation } from "../core/models/Installation";
import { contextBridge } from "electron";

export class ContextBridgeApi {
  public static readonly API_KEY = "api";

  public test = (): void => {
    send("test", {});
  };

  public requestAddBms = (manifestUrl: string): void => {
    send("requestAddBms", { manifestUrl });
  };

  public requestAddGroup = (manifestUrl: string): void => {
    send("requestAddGroup", { manifestUrl });
  };

  public requestCheckUpdates = () => {
    send("requestCheckUpdates", {});
  };

  public acceptProposedInstallation = (installations: Installation[]): void => {
    send("acceptProposedInstallations", { installations });
  };

  public listenToInstallationsUpdate: Listener<"installationsUpdated"> = (
    handler
  ) => {
    return listen("installationsUpdated", handler);
  };

  public listenToInstallationProgresses: Listener<"installationProgressesUpdated"> = (
    handler
  ) => {
    return listen("installationProgressesUpdated", handler);
  };

  public listenToTest: Listener<"test"> = (handler) => {
    return listen("test", handler);
  };
}

contextBridge.exposeInMainWorld(
  ContextBridgeApi.API_KEY,
  new ContextBridgeApi()
);
