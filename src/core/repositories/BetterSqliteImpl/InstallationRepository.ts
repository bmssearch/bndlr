import { DBBms, dbToBms } from "../../adapters/bettersqlite/models/DBBms";
import {
  DBInstallation,
  dbToInstallation,
} from "../../adapters/bettersqlite/models/DBInstallation";
import {
  DBResource,
  dbToResource,
} from "../../adapters/bettersqlite/models/DBResource";

import { DatabaseConnector } from "../../adapters/bettersqlite";
import { InstallationRepository } from "../InstallationRepository";
import { InstallationStatus } from "../../models/Installation";

export class BetterSqliteInstallationRepository
  implements InstallationRepository {
  constructor(private dbc: DatabaseConnector) {}

  public list = async () => {
    const st = this.dbc
      .db()
      .prepare("SELECT * FROM installations ORDER BY createdAt DESC");
    const dbInstallations: DBInstallation[] = st.all();

    return dbInstallations.map(this.toInstallation);
  };

  public fetchLatestForResource = async (resourceId: number) => {
    const st = this.dbc
      .db()
      .prepare(
        "SELECT * FROM installations WHERE resourceId = ? ORDER BY createdAt DESC"
      );
    const dbLatest: DBInstallation | undefined = st.get(resourceId);

    return dbLatest ? this.toInstallation(dbLatest) : null;
  };

  public create = async (resourceId: number, status: InstallationStatus) => {
    const st = this.dbc.db().prepare("SELECT * FROM resources WHERE id = ?");
    const dbResource: DBResource | undefined = st.get(resourceId);

    if (!dbResource) throw Error("no corresponing resource found");

    const ist = this.dbc
      .db()
      .prepare(
        "INSERT INTO installations (resourceId, status, createdAt) VALUES (:resourceId, :status, :createdAt)"
      );
    const info = ist.run({
      resourceId,
      status,
      createdAt: new Date().toISOString(),
    });

    const gst = this.dbc
      .db()
      .prepare("SELECT * FROM installations WHERE id = ?");
    const dbInstallation: DBInstallation = gst.get(info.lastInsertRowid);

    return this.toInstallation(dbInstallation);
  };

  public updateStatus = async (id: number, status: InstallationStatus) => {
    const st = this.dbc
      .db()
      .prepare(
        "UPDATE installations SET status = :status, checkedAt = :checkedAt WHERE id = :id"
      );
    st.run({
      id,
      status,
      checkedAt: new Date().toISOString(),
    });
  };

  public delete = async (id: number) => {
    const st = this.dbc.db().prepare("DELETE FROM installations WHERE id = ?");
    st.run(id);
  };

  private toInstallation = (dbInstallation: DBInstallation) => {
    const st = this.dbc.db().prepare("SELECT * FROM resources WHERE id = ?");
    const dbResource: DBResource = st.get(dbInstallation.resourceId);

    const bst = this.dbc.db().prepare("SELECT * FROM bmses WHERE id = ?");
    const dbBms: DBBms = bst.get(dbResource.bmsId);

    const bms = dbToBms(dbBms);
    const resource = dbToResource(dbResource, bms);
    return dbToInstallation(dbInstallation, resource);
  };
}
