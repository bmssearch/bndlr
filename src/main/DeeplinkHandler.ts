import { AppEventEmitter } from "./AppHandler/types";
import Router from "url-router";

export class DeeplinkHandler {
  constructor(private appEventEmitter: AppEventEmitter) {}

  public handle = (url: string) => {
    const path = url.replace(/^bndlr:\/\//, "");

    type Handler = (params: Record<string, string>) => void;
    const router = new Router<Handler>();

    router.add("manifest/bms?url=:url(.*)", (params) => {
      if (!params.url) return;
      this.appEventEmitter.emit("importBmsManifest", {
        manifestUrl: params.url,
      });
    });

    router.add("manifest/group?url=:url(.*)", (params) => {
      if (!params.url) return;
      this.appEventEmitter.emit("importGroupManifest", {
        manifestUrl: params.url,
      });
    });

    const res = router.find(path);
    res?.handler(res.params);
  };
}
