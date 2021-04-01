import { EventKey, EventList } from "../../../api/events";

import { EventEmitter } from "events";

type Handler<K extends EventKey> = (channel: K, params: EventList[K]) => void;

export class AppEventDelivery {
  private eventEmitter: EventEmitter;

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  public onEvent = <K extends EventKey>(handler: Handler<K>) => {
    this.eventEmitter.on("event", handler);
  };

  public removeListener = <K extends EventKey>(handler: Handler<K>) => {
    this.eventEmitter.removeListener("event", handler);
  };

  public emit = (channel: string, ...args: any[]) => {
    this.eventEmitter.emit("event", channel, ...args);
  };
}
