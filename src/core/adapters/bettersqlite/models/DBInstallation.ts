import { Installation } from "../../../models/Installation";
import { Resource } from "../../../models/Resource";

type DBInstallationStatus = "proposed" | "installed" | "failed" | "skipped";

export interface DBInstallation {
  id: number;
  resourceId: number;
  status: DBInstallationStatus;
  checkedAt?: string;
  createdAt: string;
}

export const dbToInstallation = (
  db: DBInstallation,
  resource: Resource
): Installation => {
  return new Installation({
    id: db.id,
    resource,
    status: db.status,
    checkedAt: db.checkedAt ? new Date(db.checkedAt) : undefined,
    createdAt: new Date(db.createdAt),
  });
};
