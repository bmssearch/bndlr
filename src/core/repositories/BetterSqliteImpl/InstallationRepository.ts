import { DBBms, dbToBms } from "../../adapters/bettersqlite/models/DBBms";
import {
  DBInstallation,
  dbToInstallation,
} from "../../adapters/bettersqlite/models/DBInstallation";
import {
  DBResource,
  dbToResource,
} from "../../adapters/bettersqlite/models/DBResource";

import { InstallationRepository } from "../InstallationRepository";
import { InstallationStatus } from "../../models/Installation";
import { db } from "../../adapters/bettersqlite";

export class BetterSqliteInstallationRepository
  implements InstallationRepository {
  public list = async () => {
    const st = db.prepare(
      "SELECT * FROM installations ORDER BY createdAt DESC"
    );
    const dbInstallations: DBInstallation[] = st.all();

    return dbInstallations.map(toInstallation);
  };

  public fetchLatestForResource = async (resourceId: number) => {
    const st = db.prepare(
      "SELECT * FROM installations WHERE resourceId = ? ORDER BY createdAt DESC"
    );
    const dbLatest: DBInstallation | undefined = st.get(resourceId);

    return dbLatest ? toInstallation(dbLatest) : null;
  };

  public create = async (resourceId: number, status: InstallationStatus) => {
    const st = db.prepare("SELECT * FROM resources WHERE id = ?");
    const dbResource: DBResource | undefined = st.get(resourceId);

    if (!dbResource) throw Error("no corresponing resource found");

    const ist = db.prepare(
      "INSERT INTO installations (resourceId, status, createdAt) VALUES (:resourceId, :status, :createdAt)"
    );
    const info = ist.run({
      resourceId,
      status,
      createdAt: new Date().toISOString(),
    });

    const gst = db.prepare("SELECT * FROM installations WHERE id = ?");
    const dbInstallation: DBInstallation = gst.get(info.lastInsertRowid);

    return toInstallation(dbInstallation);
  };

  public updateStatus = async (id: number, status: InstallationStatus) => {
    const st = db.prepare(
      "UPDATE installations SET status = :status, checkedAt = :checkedAt WHERE id = :id"
    );
    st.run({
      id,
      status,
      checkedAt: new Date().toISOString(),
    });
  };

  public delete = async (id: number) => {
    const st = db.prepare("DELETE FROM installations WHERE id = ?");
    st.run(id);
  };
}

const toInstallation = (dbInstallation: DBInstallation) => {
  const st = db.prepare("SELECT * FROM resources WHERE id = ?");
  const dbResource: DBResource = st.get(dbInstallation.resourceId);

  const bst = db.prepare("SELECT * FROM bmses WHERE id = ?");
  const dbBms: DBBms = bst.get(dbResource.bmsId);

  const bms = dbToBms(dbBms);
  const resource = dbToResource(dbResource, bms);
  return dbToInstallation(dbInstallation, resource);
};
