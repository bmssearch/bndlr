import { DBBms } from "../../adapters/sequelize/models/DBBms";
import { DBResource } from "../../adapters/sequelize/models/DBResource";
import { ResourceManifest } from "../../models/ResourceManifest";
import { ResourceRepository } from "../ResourceRepository";

export class SequelizeResourceRepository implements ResourceRepository {
  public fetch = async (bmsId: number, url: string) => {
    const dbResource = await DBResource.findOne({
      where: { bmsId, url },
      include: [{ model: DBBms, as: "bms" }],
    });

    if (!dbResource) return null;
    const bms = dbResource.bms!.toBms();
    return dbResource ? dbResource.toResource(bms) : null;
  };

  public save = async (resource: ResourceManifest, bmsId: number) => {
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
