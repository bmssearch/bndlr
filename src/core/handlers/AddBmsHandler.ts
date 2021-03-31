import { ResourceFilter, ResourceFilterConfig } from "../app/ResourceFilter";

import { BmsSpec as BbsBmsSpec } from "@bmssearch/bms-bundle-spec";
import { BmsRepository } from "../repositories/BmsRepository";
import { BmsSpec } from "../models/BmsSpec";
import { ObservationRepository } from "../repositories/ObservationRepository";
import { Resource } from "../models/Resource";
import { ResourceRepository } from "../repositories/ResourceRepository";
import { SpecFetcher } from "../adapters/SpecFetcher";

export class AddBmsHandler {
  constructor(
    private specFetcher: SpecFetcher,
    private bmsRepository: BmsRepository,
    private observationRepository: ObservationRepository,
    private resourceRepoisotry: ResourceRepository
  ) {}

  public handle = async (specUrl: string): Promise<Resource[]> => {
    const rawSpec = await this.specFetcher.fetch(specUrl);
    const bbsBmsSpec = BbsBmsSpec.assert(rawSpec);
    const bmsSpec = BmsSpec.fromSpec(specUrl, bbsBmsSpec);
    const bms = await this.bmsRepository.save(bmsSpec, new Date());
    if (bmsSpec.updatesSpecUrl) {
      await this.observationRepository.createOrIgnore(
        bmsSpec.updatesSpecUrl,
        new Date()
      );
    }
    const resourcesToQueue = resourceFilter.filter(bmsSpec.resources);
    const resources: Resource[] = [];
    for (const resource of resourcesToQueue) {
      const r = await this.resourceRepoisotry.save(resource, bms.id);
      resources.push(r);
      // queueをおく
    }
    return resources;
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
