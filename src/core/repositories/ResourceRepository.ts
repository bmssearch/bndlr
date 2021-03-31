import { DBResource } from "../adapters/database/models/DBResource";
import { Resource } from "../models/Resource";
import { ResourceSpec } from "../models/ResourceSpec";

export interface ResourceRepository {
  save: (Resource: ResourceSpec, bmsId: number) => Promise<Resource>;
}

export class LocalDbResourceRepository implements ResourceRepository {
  public save = async (resource: ResourceSpec, bmsId: number) => {
    // bmsId と urlがともに一致するものを同一とみなす

    const existing = await DBResource.findOne({
      where: {
        bmsId,
        url: resource.url,
      },
    });

    let dbResource: DBResource;
    if (existing) {
      existing.url = resource.url;
      existing.type = resource.type;
      dbResource = await existing.save();
    } else {
      dbResource = await DBResource.create({
        bmsId,
        url: resource.url,
        type: resource.type,
      });
    }

    return dbResource.toResource();
  };
}
