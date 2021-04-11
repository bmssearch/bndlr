import { DBGroup, dbToGroup } from "../../adapters/bettersqlite/models/DBGroup";

import { Group } from "../../models/Group";
import { GroupManifest } from "../../models/GroupManifest";
import { GroupRepository } from "../GroupRepository";
import { Identifier } from "../../models/Identity";
import { db } from "../../adapters/bettersqlite";

export class BetterSqliteGroupRepository implements GroupRepository {
  public fetch = async (identifier: Identifier) => {
    const st = db.prepare(
      "SELECT * FROM groups WHERE domain = ? AND domainScopedId = ?"
    );
    const dbGroup: DBGroup | undefined = st.get(
      identifier.domain,
      identifier.domainScopedId
    );
    return dbGroup ? dbToGroup(dbGroup) : null;
  };

  public list = async (identifiers: Identifier[]) => {
    const st = db.prepare(
      "SELECT * FROM groups WHERE domain = ? AND domainScopedId = ?"
    );
    const tx = db.transaction((idfrs: Identifier[]) => {
      return idfrs.map((idfr) => st.get(idfr.domain, idfr.domainScopedId));
    });
    const dbGroups: DBGroup[] = tx(identifiers).filter((v) => !!v);
    console.log(dbGroups);
    return dbGroups.map(dbToGroup);
  };

  public update = async (id: number, groupManifest: GroupManifest) => {
    const st = db.prepare("UPDATE groups SET name = ? WHERE id = ?");
    st.run(groupManifest.name, id);
  };

  public create = async (groupManifest: GroupManifest): Promise<Group> => {
    const st = db.prepare(
      "INSERT INTO groups (domain, domainScopedId, name, autoAddNewBmses) VALUES (:domain, :domainScopedId, :name, :autoAddNewBmses)"
    );
    const info = st.run({
      domain: groupManifest.domain,
      domainScopedId: groupManifest.domainScopedId,
      name: groupManifest.name,
      autoAddNewBmses: 1,
    });

    const gst = db.prepare("SELECT * FROM groups WHERE id = ?");
    const dbGroup: DBGroup = gst.get(info.lastInsertRowid);
    return dbToGroup(dbGroup);
  };
}
