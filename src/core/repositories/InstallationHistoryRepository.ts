import { DBInstallationHistory } from "../adapters/database/models/DBInstallationHistory";
import { InstallationHistory } from "../models/InstallationHistory";

export interface InstallationHistoryRepository {
  create: (
    resourceId: number,
    result: "installed" | "failed" | "skipped",
    checkedAt: Date
  ) => Promise<InstallationHistory>;

  fetchLatestForResource: (
    resourceId: number
  ) => Promise<InstallationHistory | null>;
}

export class LocalDbInstallationHistoryRepository
  implements InstallationHistoryRepository {
  public create = async (
    resourceId: number,
    result: "installed" | "failed" | "skipped",
    checkedAt: Date
  ) => {
    const dbCreated = await DBInstallationHistory.create({
      resourceId,
      result,
      checkedAt,
    });
    return dbCreated.toInstallationHistory();
  };

  public fetchLatestForResource = async (resourceId: number) => {
    const dbHistory = await DBInstallationHistory.findOne({
      where: { resourceId },
      order: [["checkedAt", "DESC"]],
    });
    return dbHistory ? dbHistory.toInstallationHistory() : null;
  };
}
