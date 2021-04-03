import { DBInstallationProposal } from "../adapters/database/models/DBInstallationProposal";
import { InstallationProposal } from "../models/InstallationProposal";

export interface InstallationProposalRepository {
  list: () => Promise<InstallationProposal[]>;

  fetchLatestForResource: (
    resourceId: number
  ) => Promise<InstallationProposal | null>;

  create: (
    resourceId: number,
    updatedAt?: Date
  ) => Promise<InstallationProposal>;

  delete: (id: number) => Promise<void>;
}

export class LocalDbInstallationProposalRepository
  implements InstallationProposalRepository {
  public list = async () => {
    const dbProposals = await DBInstallationProposal.findAll({ limit: 20 });
    return dbProposals.map((v) => v.toInstallationProposal());
  };

  public fetchLatestForResource = async (resourceId: number) => {
    const dbLatest = await DBInstallationProposal.findOne({
      where: { resourceId },
      order: [["updatedAt", "DESC"]],
    });
    return dbLatest ? dbLatest.toInstallationProposal() : null;
  };

  public create = async (resourceId: number, updatedAt?: Date) => {
    const dbInstallationProposal = await DBInstallationProposal.create({
      resourceId,
      updatedAt: updatedAt || null,
    });

    return dbInstallationProposal.toInstallationProposal();
  };

  public delete = async (id: number) => {
    await DBInstallationProposal.destroy({ where: { id } });
    return;
  };
}
