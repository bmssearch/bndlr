import { DBBms, dbToBms } from "../../adapters/bettersqlite/models/DBBms";

import { Bms } from "../../models/Bms";
import { BmsManifest } from "../../models/BmsManifest";
import { BmsRepository } from "../BmsRepository";
import { DatabaseConnector } from "../../adapters/bettersqlite";
import { Identifier } from "../../models/Identity";

export class BetterSqlBmsRepository implements BmsRepository {
  constructor(private dbc: DatabaseConnector) {}

  public list = async (identifiers: Identifier[]) => {
    const st = this.dbc
      .db()
      .prepare("SELECT * FROM bmses WHERE domain = ? AND domainScopedId = ?");
    const tx = this.dbc.db().transaction((idfrs: Identifier[]) => {
      return idfrs.map((idfr) => st.get(idfr.domain, idfr.domainScopedId));
    });

    const dbBmses: DBBms[] = tx(identifiers).filter((v) => !!v);
    return dbBmses.map(dbToBms);
  };

  public listForGroup = async (groupId: number) => {
    const st = this.dbc
      .db()
      .prepare("SELECT * FROM group_bmses WHERE groupId = ?");
    const dbBmses: DBBms[] = st.all(groupId);
    return dbBmses.map(dbToBms);
  };

  public update = async (id: number, bmsManifest: BmsManifest) => {
    const st = this.dbc.db().prepare("UPDATE bmses SET title = ? WHERE id = ?");
    st.run(bmsManifest.title, id);
  };

  public create = async (bmsManifest: BmsManifest): Promise<Bms> => {
    const st = this.dbc
      .db()
      .prepare(
        "INSERT INTO bmses (domain, domainScopedId, title) VALUES (:domain, :domainScopedId, :title) "
      );
    const info = st.run({
      domain: bmsManifest.domain,
      domainScopedId: bmsManifest.domainScopedId,
      title: bmsManifest.title,
    });

    const gst = this.dbc.db().prepare("SELECT * FROM bmses WHERE id = ?");
    const dbBms: DBBms = gst.get(info.lastInsertRowid);

    return dbToBms(dbBms);
  };
}
