import { DBGroup, dbToGroup } from "../../adapters/bettersqlite/models/DBGroup";

import { DatabaseConnector } from "../../adapters/bettersqlite";
import { Group } from "../../models/Group";
import { GroupManifest } from "../../models/GroupManifest";
import { GroupRepository } from "../GroupRepository";
import { Identifier } from "../../models/Identity";

export class BetterSqliteGroupRepository implements GroupRepository {
  constructor(private dbc: DatabaseConnector) {}

  public fetch = async (identifier: Identifier) => {
    const st = this.dbc
      .db()
      .prepare("SELECT * FROM groups WHERE domain = ? AND domainScopedId = ?");
    const dbGroup: DBGroup | undefined = st.get(
      identifier.domain,
      identifier.domainScopedId
    );
    return dbGroup ? dbToGroup(dbGroup) : null;
  };

  public list = async (identifiers: Identifier[]) => {
    const st = this.dbc
      .db()
      .prepare("SELECT * FROM groups WHERE domain = ? AND domainScopedId = ?");
    const tx = this.dbc.db().transaction((idfrs: Identifier[]) => {
      return idfrs.map((idfr) => st.get(idfr.domain, idfr.domainScopedId));
    });
    const dbGroups: DBGroup[] = tx(identifiers).filter((v) => !!v);
    console.log(dbGroups);
    return dbGroups.map(dbToGroup);
  };

  public update = async (id: number, groupManifest: GroupManifest) => {
    const st = this.dbc.db().prepare("UPDATE groups SET name = ? WHERE id = ?");
    st.run(groupManifest.name, id);
  };

  public create = async (groupManifest: GroupManifest): Promise<Group> => {
    const st = this.dbc
      .db()
      .prepare(
        "INSERT INTO groups (domain, domainScopedId, name, autoAddNewBmses) VALUES (:domain, :domainScopedId, :name, :autoAddNewBmses)"
      );
    const info = st.run({
      domain: groupManifest.domain,
      domainScopedId: groupManifest.domainScopedId,
      name: groupManifest.name,
      autoAddNewBmses: 1,
    });

    const gst = this.dbc.db().prepare("SELECT * FROM groups WHERE id = ?");
    const dbGroup: DBGroup = gst.get(info.lastInsertRowid);
    return dbToGroup(dbGroup);
  };
}
