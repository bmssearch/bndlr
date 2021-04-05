import { DBBms } from "../adapters/database/models/DBBms";
import { DBResource } from "../adapters/database/models/DBResource";
import { Resource } from "../models/Resource";
import { ResourceSpec } from "../models/ResourceSpec";

export interface ResourceRepository {
  fetch: (bmsId: number, url: string) => Promise<Resource | null>;
  save: (Resource: ResourceSpec, bmsId: number) => Promise<Resource>;
}

export class LocalDbResourceRepository implements ResourceRepository {
  public fetch = async (bmsId: number, url: string) => {
    const dbResource = await DBResource.findOne({
      where: { bmsId, url },
      include: [{ model: DBBms, as: "bms" }],
    });

    if (!dbResource) return null;
    const bms = dbResource.bms!.toBms();
    return dbResource ? dbResource.toResource(bms) : null;
  };

  public save = async (resource: ResourceSpec, bmsId: number) => {
    // bmsId と urlがともに一致するものを同一とみなす

    const dbBms = await DBBms.findByPk(bmsId);
    if (!dbBms) {
      throw Error("no corresponding bms found");
    }

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
      existing.updatedAt = resource.updatedAt;
      dbResource = await existing.save();
    } else {
      dbResource = await DBResource.create({
        bmsId,
        url: resource.url,
        type: resource.type,
        updatedAt: resource.updatedAt,
      });
    }

    return dbResource.toResource(dbBms.toBms());
  };
}
