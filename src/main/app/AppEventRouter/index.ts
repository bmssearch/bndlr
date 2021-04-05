import { AppEventEmitter } from "./types";
import { AppHandler } from "../../../core/app/AppHandler";
import { BridgeEventRelay } from "../BridgeEventRelay";
import { InstallationProgress } from "../../../core/models/InstallationProgress";
import { throttle } from "throttle-debounce";

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
      this.emitter.emit("reloadInstallations", {});
    });

    this.emitter.on("execInstallations", ({ installations }) => {
      installations.forEach((installation) => {
        this.appHandler.putInstallationIntoTaskQueue(installation);
      });
    });

    this.emitter.on("reloadInstallations", async () => {
      const installations = await this.appHandler.fetchInstallations();
      this.relay.deliver("installationsUpdated", {
        installations,
      });
    });

    this.emitter.on(
      "progressOnInstallations",
      throttle(80, true, async ({ items }) => {
        const installationProgresses = items.map((item) => {
          const installationId = item.entity.id;
          if (item.status === "queued") {
            return new InstallationProgress({
              installationId,
              progress: { type: "queued" },
            });
          }
          switch (item.progress?.type) {
            case "connecting":
              return new InstallationProgress({
                installationId,
                progress: { type: "connecting" },
              });
            case "transferring":
              return new InstallationProgress({
                installationId,
                progress: {
                  type: "transferring",
                  transferedByte: item.progress.transferedByte,
                  totalByte: item.progress.totalByte,
                },
              });
            case "extracting":
              return new InstallationProgress({
                installationId,
                progress: { type: "extracting" },
              });
            case "copying":
              return new InstallationProgress({
                installationId,
                progress: { type: "copying" },
              });
            case "cleaning":
              return new InstallationProgress({
                installationId,
                progress: { type: "cleaning" },
              });
            default:
              return new InstallationProgress({ installationId });
          }
        });

        this.relay.deliver("installationProgressesUpdated", {
          installationProgresses,
        });
      })
    );
  };
}
