import { AppEventEmitter } from "./AppEventRouter/types";
import Router from "url-router";

export class DeeplinkHandler {
  constructor(private appEventEmitter: AppEventEmitter) {}

  public handle = (url: string) => {
    const path = url.replace(/^bndlr:\/\//, "");

    type Handler = (params: Record<string, string>) => void;
    const router = new Router<Handler>();

    router.add("manifest/bms?url=:url(.*)", (params) => {
      if (!params.url) return;
      this.appEventEmitter.emit("addBms", { manifestUrl: params.url });
    });

    const res = router.find(path);
    res?.handler(res.params);
  };
}
