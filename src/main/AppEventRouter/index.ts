import { AppEventEmitter } from "./types";
import { BridgeEventRelay } from "../BridgeEventRelay";
import { InstallationProgress } from "../../core/models/InstallationProgress";
import { Service } from "../../core/app/Service";
import { throttle } from "throttle-debounce";

export class AppEventRouter {
  constructor(
    private emitter: AppEventEmitter,
    private service: Service,
    private relay: BridgeEventRelay
  ) {}

  public listen = () => {
    this.emitter.removeAllListeners();

    this.emitter.on("addBms", async ({ manifestUrl }) => {
      await this.service.addBms(manifestUrl);
      this.emitter.emit("reloadInstallations", {});
    });

    this.emitter.on("addGroup", async ({ manifestUrl }) => {
      await this.service.addGroup(manifestUrl);
      this.emitter.emit("reloadInstallations", {});
    });

    this.emitter.on("checkUpdates", async () => {
      await this.service.checkUpdates();
    });

    this.emitter.on("execInstallations", ({ installations }) => {
      installations.forEach((installation) => {
        this.service.putInstallationIntoTaskQueue(installation);
      });
    });

    this.emitter.on("reloadInstallations", async () => {
      const installations = await this.service.fetchInstallations();
      this.relay.deliver("installationsUpdated", {
        installations,
      });
    });

    this.emitter.on(
      "progressOnInstallations",
      throttle(80, async ({ items }) => {
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

    this.emitter.on("finishInstallation", async ({ installationId }) => {
      await this.service.updateInstallationStatus(installationId, "installed");
      this.emitter.emit("reloadInstallations", {});
    });

    this.emitter.on("failInstallation", async ({ installationId }) => {
      await this.service.updateInstallationStatus(installationId, "failed");
      this.emitter.emit("reloadInstallations", {});
    });
  };
}
