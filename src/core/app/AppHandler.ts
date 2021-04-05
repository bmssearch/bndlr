import { ResourceFilter, ResourceFilterConfig } from "./ResourceFilter";

import { BmsRepository } from "../repositories/BmsRepository";
import { BmsSpecRepository } from "../repositories/BmsSpecRepository";
import { Installation } from "../models/Installation";
import { InstallationRepository } from "../repositories/InstallationRepository";
import { InstallationWorker } from "../workers/InstallationWorker";
import { ObservationRepository } from "../repositories/ObservationRepository";
import { ResourceRepository } from "../repositories/ResourceRepository";
import { isUpToDate } from "../utils/date";

export class AppHandler {
  constructor(
    private installationWorker: InstallationWorker,

    private bmsSpecRepository: BmsSpecRepository,

    private bmsRepository: BmsRepository,
    private observationRepository: ObservationRepository,
    private resourceRepoisotry: ResourceRepository,
    private installationRepoisotry: InstallationRepository
  ) {}

  public putInstallationIntoTaskQueue = async (installation: Installation) => {
    // InstallationProgressを生成
    this.installationWorker.put(installation);
  };

  public fetchInstallations = async (): Promise<Installation[]> => {
    const installations = await this.installationRepoisotry.list();
    return installations;
  };

  public addBms = async (specUrl: string): Promise<void> => {
    const bmsSpec = await this.bmsSpecRepository.fetch(specUrl);
    const bms = await this.bmsRepository.save(bmsSpec, new Date());
    if (bmsSpec.updatesSpecUrl) {
      await this.observationRepository.createOrIgnore(
        bmsSpec.updatesSpecUrl,
        new Date()
      );
    }
    const resourcesToBeInstalled = resourceFilter.filter(bmsSpec.resources);

    for (const toBeInstalled of resourcesToBeInstalled) {
      // リソース自体の情報は常に更新しておく
      const resource = await this.resourceRepoisotry.save(
        toBeInstalled,
        bms.id
      );

      const latestInstallation = await this.installationRepoisotry.fetchLatestForResource(
        resource.id
      );

      if (isUpToDate(toBeInstalled.updatedAt, latestInstallation?.createdAt)) {
        continue;
      }

      if (latestInstallation?.status === "proposed") {
        await this.installationRepoisotry.updateStatus(
          latestInstallation.id,
          "skipped"
        );
      }

      await this.installationRepoisotry.create(resource.id);
    }
    return;
  };
}

const resourceFilterConfig: ResourceFilterConfig = {
  core: {
    selectionMethod: "latest",
  },
  patch: {
    enabled: false,
  },
  additional: {
    enabled: true,
  },
};
const resourceFilter = new ResourceFilter(resourceFilterConfig);
