import {
  BridgeEventEmitter,
  BridgeEventHandler,
  RelayEventEmitter,
} from "./types";

import { AppEventEmitter } from "../AppEventRouter/types";
import { BridgeEventList } from "../../../api/events";

export class BridgeEventRelay {
  private relayEventEmitter: RelayEventEmitter;

  constructor(
    private bridgeEventEmitter: BridgeEventEmitter,
    private appEventEmitter: AppEventEmitter
  ) {
    this.relayEventEmitter = new RelayEventEmitter();
  }

  public listen = () => {
    this.bridgeEventEmitter.on("test", () => {
      console.log("テストだよ");
    });

    this.bridgeEventEmitter.on("requestAddBms", async (event, { specUrl }) => {
      console.log("request add bms");
      this.appEventEmitter.emit("addBms", { specUrl });
    });

    this.bridgeEventEmitter.on(
      "acceptProposedInstallations",
      async (event, { installations }) => {
        this.appEventEmitter.emit("execInstallations", { installations });
      }
    );
  };

  public onEvent = <K extends keyof BridgeEventList>(
    handler: BridgeEventHandler<K>
  ) => {
    this.relayEventEmitter.on("event", handler);
  };
  public removeListener = <K extends keyof BridgeEventList>(
    handler: BridgeEventHandler<K>
  ) => {
    this.relayEventEmitter.removeListener("event", handler);
  };
  public deliver = <K extends keyof BridgeEventList>(
    channel: K,
    params: BridgeEventList[K]
  ) => {
    this.relayEventEmitter.emit("event", channel, params);
  };
}
