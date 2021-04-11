import { DBBms } from "../../adapters/sequelize/models/DBBms";
import { DBInstallation } from "../../adapters/sequelize/models/DBInstallation";
import { DBResource } from "../../adapters/sequelize/models/DBResource";
import { InstallationRepository } from "../InstallationRepository";
import { InstallationStatus } from "../../models/Installation";

export class SequelizeInstallationRepository implements InstallationRepository {
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

  public create = async (resourceId: number, status: InstallationStatus) => {
    const dbResource = await DBResource.findByPk(resourceId, {
      include: { model: DBBms, as: "bms" },
    });
    if (!dbResource) throw Error("no corresponing resource found");
    const dbInstallation = await DBInstallation.create({
      resourceId,
      status: status,
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
