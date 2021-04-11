import { DBBms, dbToBms } from "../../adapters/bettersqlite/models/DBBms";

import { Bms } from "../../models/Bms";
import { BmsManifest } from "../../models/BmsManifest";
import { BmsRepository } from "../BmsRepository";
import { Identifier } from "../../models/Identity";
import { db } from "../../adapters/bettersqlite";

export class BetterSqlBmsRepository implements BmsRepository {
  public list = async (identifiers: Identifier[]) => {
    const st = db.prepare(
      "SELECT * FROM bmses WHERE domain = ? AND domainScopedId = ?"
    );
    const tx = db.transaction((idfrs: Identifier[]) => {
      return idfrs.map((idfr) => st.get(idfr.domain, idfr.domainScopedId));
    });

    const dbBmses: DBBms[] = tx(identifiers).filter((v) => !!v);
    return dbBmses.map(dbToBms);
  };

  public update = async (id: number, bmsManifest: BmsManifest) => {
    const st = db.prepare("UPDATE bmses SET title = ? WHERE id = ?");
    st.run(bmsManifest.title, id);
  };

  public create = async (bmsManifest: BmsManifest): Promise<Bms> => {
    const st = db.prepare(
      "INSERT INTO bmses (domain, domainScopedId, title) VALUES (:domain, :domainScopedId, :title) "
    );
    const info = st.run({
      domain: bmsManifest.domain,
      domainScopedId: bmsManifest.domainScopedId,
      title: bmsManifest.title,
    });

    const gst = db.prepare("SELECT * FROM bmses WHERE id = ?");
    const dbBms: DBBms = gst.get(info.lastInsertRowid);

    return dbToBms(dbBms);
  };
}
