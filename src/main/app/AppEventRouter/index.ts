import { AppEventEmitter } from "./types";
import { AppHandler } from "../../../core/app/AppHandler";
import { BridgeEventRelay } from "../BridgeEventRelay";

export class AppEventRouter {
  constructor(
    private emitter: AppEventEmitter,
    private appHandler: AppHandler,
    private relay: BridgeEventRelay
  ) {}

  public listen = () => {
    this.emitter.removeAllListeners();

    this.emitter.on("addBms", async ({ specUrl }) => {
      console.log("add Bms");
      await this.appHandler.addBms(specUrl);
      this.emitter.emit("reloadInstallationProposals", {});
    });

    this.emitter.on("installResources", ({ resources }) => {
      resources.forEach((resource) => {
        this.appHandler.putResourceIntoInstallationTaskQueue(resource);
      });
    });

    this.emitter.on("reloadInstallationProposals", async () => {
      const proposals = await this.appHandler.fetchInstallationProposals();
      this.relay.deliver("installationProposalsUpdated", {
        installationProposals: proposals,
      });
    });
  };
}
