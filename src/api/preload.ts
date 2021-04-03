import { Listener, listen, send } from "./helpers";

import { Resource } from "../core/models/Resource";
import { contextBridge } from "electron";

export class ContextBridgeApi {
  public static readonly API_KEY = "api";

  public test = (): void => {
    send("test", {});
  };

  public requestAddBms = (specUrl: string): void => {
    send("requestAddBms", { specUrl });
  };

  public requestInstallResources = (resources: Resource[]): void => {
    send("requestInstallResources", { resources });
  };

  public listenToInstallationProposalsUpdate: Listener<"installationProposalsUpdated"> = (
    handler
  ) => {
    return listen("installationProposalsUpdated", handler);
  };

  public listenToTest: Listener<"test"> = (handler) => {
    return listen("test", handler);
  };
}

contextBridge.exposeInMainWorld(
  ContextBridgeApi.API_KEY,
  new ContextBridgeApi()
);
