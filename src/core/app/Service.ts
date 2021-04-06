import { Installation, InstallationStatus } from "../models/Installation";
import { ResourceFilter, ResourceFilterConfig } from "./ResourceFilter";

import { BmsRepository } from "../repositories/BmsRepository";
import { BmsSpecRepository } from "../repositories/BmsSpecRepository";
import { GroupManifestRepository } from "../repositories/GroupManifestRepository";
import { GroupRepository } from "../repositories/GroupRepository";
import { InstallationRepository } from "../repositories/InstallationRepository";
import { InstallationWorker } from "../workers/InstallationWorker";
import { ObservationRepository } from "../repositories/ObservationRepository";
import { ResourceRepository } from "../repositories/ResourceRepository";
import { UpdatesManifestRepository } from "../repositories/UpdatesManifestRepository";
import { isUpToDate } from "../utils/date";

export class Service {
  constructor(
    private installationWorker: InstallationWorker,

    private bmsSpecRepository: BmsSpecRepository,
    private groupManifestRepository: GroupManifestRepository,
    private updatesManifestRepository: UpdatesManifestRepository,

    private bmsRepository: BmsRepository,
    private groupRepository: GroupRepository,
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

  public updateInstallationStatus = async (
    installationId: number,
    status: InstallationStatus
  ): Promise<void> => {
    await this.installationRepoisotry.updateStatus(installationId, status);
  };

  public addBms = async (specUrl: string): Promise<void> => {
    const bmsSpec = await this.bmsSpecRepository.fetch(specUrl);
    // ここでグループの情報も記録する
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

  public addGroup = async (manifestUrl: string) => {
    const groupManifest = await this.groupManifestRepository.fetch(manifestUrl);
    // グループを記録する。同一グループが存在したら記録しない。
    const group = await this.groupRepository.save(groupManifest, true);

    if (groupManifest.updatesManifestUrl) {
      await this.observationRepository.createOrIgnore(
        groupManifest.updatesManifestUrl,
        new Date()
      );
    }

    if (groupManifest.bmses) {
      for (const b of groupManifest.bmses) {
        await this.addBms(b.manifestUrl);
      }
    }
  };

  public checkUpdates = async () => {
    const observations = await this.observationRepository.list();
    for (const observation of observations) {
      const updates = await this.updatesManifestRepository.fetch(
        observation.specUrl
      );

      if (!updates.bmses) continue;
      for (const updatedBms of updates.bmses) {
        // レコードからBMS引っ張ってきて、最新かどうか調べる
        const corrBms = await this.bmsRepository.fetch(
          updatedBms.domain,
          updatedBms.domainScopedId
        );
        const shouldUpdate = corrBms
          ? !isUpToDate(updatedBms.updatedAt, corrBms.checkedAt)
          : false;

        // groupIDが指定されていれば、レコードからgroup引っ張ってきて自動追加対象か調べる
        let belongsToAutoAddingGroup = false;
        if (updatedBms.domainScopedGroupId) {
          const corrGroup = await this.groupRepository.fetch(
            updatedBms.domain,
            updatedBms.domainScopedGroupId
          );
          if (corrGroup && corrGroup.autoDownloadNewBmses) {
            belongsToAutoAddingGroup = true;
          }
        }

        if (shouldUpdate || belongsToAutoAddingGroup) {
          await this.addBms(updatedBms.manifestUrl);
        }
      }
    }
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
