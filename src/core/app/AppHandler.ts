import { ResourceFilter, ResourceFilterConfig } from "./ResourceFilter";

import { BmsRepository } from "../repositories/BmsRepository";
import { BmsSpecRepository } from "../repositories/BmsSpecRepository";
import { InstallationHistoryRepository } from "../repositories/InstallationHistoryRepository";
import { InstallationProposal } from "../models/InstallationProposal";
import { InstallationProposalRepository } from "../repositories/InstallationProposalRepository";
import { ObservationRepository } from "../repositories/ObservationRepository";
import { Queue } from "../adapters/Queue";
import { Resource } from "../models/Resource";
import { ResourceRepository } from "../repositories/ResourceRepository";
import { isUpToDate } from "../utils/date";

export class AppHandler {
  constructor(
    private installationTaskQueue: Queue<Resource>,
    private bmsSpecRepository: BmsSpecRepository,
    private bmsRepository: BmsRepository,
    private observationRepository: ObservationRepository,
    private resourceRepoisotry: ResourceRepository,
    private installationProposalRepoisotry: InstallationProposalRepository,
    private installationHistoryRepoisotry: InstallationHistoryRepository
  ) {}

  public putResourceIntoInstallationTaskQueue = async (resource: Resource) => {
    this.installationTaskQueue.put(resource);
  };

  public fetchInstallationProposals = async (): Promise<
    InstallationProposal[]
  > => {
    const proposals = await this.installationProposalRepoisotry.list();
    return proposals;
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
    const resourceSpecsForProposal = resourceFilter.filter(bmsSpec.resources);

    for (const resourceSpec of resourceSpecsForProposal) {
      // リソース自体の情報は常に更新しておく
      const resource = await this.resourceRepoisotry.save(resourceSpec, bms.id);

      // 履歴に最新のものがあったらスキップ
      const latestHistory = await this.installationHistoryRepoisotry.fetchLatestForResource(
        resource.id
      );
      if (isUpToDate(resourceSpec.updatedAt, latestHistory?.checkedAt)) {
        continue;
      }

      // proposalsに同じものがあり、そっちのほうが新しければスキップ
      const latestProposal = await this.installationProposalRepoisotry.fetchLatestForResource(
        resource.id
      );
      if (isUpToDate(resourceSpec.updatedAt, latestProposal?.updatedAt)) {
        continue;
      }

      if (latestProposal) {
        // historyに移動
        await this.installationHistoryRepoisotry.create(
          resource.id,
          "skipped",
          new Date()
        );
        await this.installationProposalRepoisotry.delete(latestProposal.id);
      }

      await this.installationProposalRepoisotry.create(
        resource.id,
        resourceSpec.updatedAt
      );
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
