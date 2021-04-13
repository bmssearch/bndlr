import { Listener, invoke, listen, send } from "./helpers";

import { Installation } from "../core/models/Installation";
import { Preferences } from "../core/models/Preference";
import { contextBridge } from "electron";

export class ContextBridgeApi {
  public static readonly API_KEY = "api";

  public selectDirectory = async () => {
    const directory = await invoke<"selectDirectory", string>(
      "selectDirectory",
      {}
    );
    return directory;
  };
  public openMenu = async () => {
    send("openMenu", {});
  };

  public test = (): void => {
    send("test", {});
  };

  public fetchPreferences = () => {
    send("fetchPreferences", {});
  };
  public listenToPreferences: Listener<"preferencesLoaded"> = (handler) =>
    listen("preferencesLoaded", handler);
  public setPreferences = (preferences: Preferences) => {
    send("setPreferences", { preferences });
  };
  public closePreferencesWindow = () => {
    send("closePreferencesWindow", {});
  };

  public requestAddBms = (manifestUrl: string): void => {
    send("requestAddBms", { manifestUrl });
  };

  public requestAddGroup = (manifestUrl: string): void => {
    send("requestAddGroup", { manifestUrl });
  };

  public fetchInstallations = () => {
    send("fetchInstallations", {});
  };

  public acceptProposedInstallation = (installations: Installation[]): void => {
    send("acceptProposedInstallations", { installations });
  };

  public skipProposedInstallations = (installations: Installation[]): void => {
    send("skipProposedInstallations", { installations });
  };

  public listenToInstallations: Listener<"installationsLoaded"> = (handler) =>
    listen("installationsLoaded", handler);

  public listenToInstallationProgresses: Listener<"installationProgressesLoaded"> = (
    handler
  ) => listen("installationProgressesLoaded", handler);

  public listenToTest: Listener<"test"> = (handler) => listen("test", handler);
}

contextBridge.exposeInMainWorld(
  ContextBridgeApi.API_KEY,
  new ContextBridgeApi()
);
