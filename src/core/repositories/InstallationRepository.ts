import { Installation, InstallationStatus } from "../models/Installation";

import { DBBms } from "../adapters/database/models/DBBms";
import { DBInstallation } from "../adapters/database/models/DBInstallation";
import { DBResource } from "../adapters/database/models/DBResource";

export interface InstallationRepository {
  list: () => Promise<Installation[]>;

  fetchLatestForResource: (resourceId: number) => Promise<Installation | null>;

  create: (resourceId: number) => Promise<Installation>;

  updateStatus: (id: number, status: InstallationStatus) => Promise<void>;
  delete: (id: number) => Promise<void>;
}

export class LocalDbInstallationRepository implements InstallationRepository {
  public list = async () => {
    const dbInstallations = await DBInstallation.findAll({
      limit: 20,
      order: [["createdAt", "DESC"]],
      include: {
        model: DBResource,
        as: "resource",
        include: [{ model: DBBms, as: "bms" }],
      },
    });

    return dbInstallations.map((i) => {
      return i.toInstallation(i.resource!.toResource(i.resource!.bms!.toBms()));
    });
  };

  public fetchLatestForResource = async (resourceId: number) => {
    const dbLatest = await DBInstallation.findOne({
      where: { resourceId },
      order: [["createdAt", "DESC"]],
      include: {
        model: DBResource,
        as: "resource",
        include: [{ model: DBBms, as: "bms" }],
      },
    });
    if (!dbLatest) return null;

    return dbLatest.toInstallation(
      dbLatest.resource!.toResource(dbLatest.resource!.bms!.toBms())
    );
  };

  public create = async (resourceId: number) => {
    const dbResource = await DBResource.findByPk(resourceId, {
      include: { model: DBBms, as: "bms" },
    });
    if (!dbResource) throw Error("no corresponing resource found");

    const dbInstallation = await DBInstallation.create({
      resourceId,
      status: "proposed",
      createdAt: new Date(),
    });

    return dbInstallation.toInstallation(
      dbResource.toResource(dbResource.bms!.toBms())
    );
  };

  public updateStatus = async (id: number, status: InstallationStatus) => {
    await DBInstallation.update(
      { status, checkedAt: new Date() },
      { where: { id } }
    );
  };

  public delete = async (id: number) => {
    await DBInstallation.destroy({ where: { id } });
    return;
  };
}
