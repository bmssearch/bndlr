import {
  DBBmsCheck,
  dbToBmsCheck,
} from "../../adapters/bettersqlite/models/DBBmsCheck";

import { BmsCheckRepository } from "../BmsCheckRepository";
import { Identifier } from "../../models/Identity";
import { db } from "../../adapters/bettersqlite";

export class BetterSqliteBmsCheckRepository implements BmsCheckRepository {
  public fetch = async (identifier: Identifier) => {
    const st = db.prepare(
      "SELECT * FROM bms_checks WHERE domain = ? AND domainScopedId = ?"
    );
    const dbBmsCheck: DBBmsCheck | undefined = st.get(
      identifier.domain,
      identifier.domainScopedId
    );
    return dbBmsCheck ? dbToBmsCheck(dbBmsCheck) : null;
  };

  public saveCheckedAt = async (identifiers: Identifier[], checkedAt: Date) => {
    const st = db.prepare(
      "REPLACE INTO bms_checks (domain, domainScopedId, checkedAt) VALUES (?,?,?)"
    );
    const tx = db.transaction((idfrs: Identifier[]) => {
      return idfrs.map((idfr) =>
        st.run(idfr.domain, idfr.domainScopedId, checkedAt.toISOString())
      );
    });
    tx(identifiers);
  };
}
