import { Handler, listen, send } from "./helpers";

import { contextBridge } from "electron";

export class ContextBridgeApi {
  public static readonly API_KEY = "api";

  public addBms = (specUrl: string): void => {
    send("addBms", { specUrl });
  };

  public listenToResourceQueues = (handler: Handler<"updateResources">) => {
    return listen("updateResources", handler);
  };
}

contextBridge.exposeInMainWorld(
  ContextBridgeApi.API_KEY,
  new ContextBridgeApi()
);
