import { Op, WhereOptions } from "sequelize";

import { DBGroup } from "../../adapters/sequelize/models/DBGroup";
import { Group } from "../../models/Group";
import { GroupManifest } from "../../models/GroupManifest";
import { Identifier } from "../../models/Identity";

export interface GroupRepository {
  fetch: (identifier: Identifier) => Promise<Group | null>;
  list: (identifiers: Identifier[]) => Promise<Group[]>;

  update: (id: number, groupManifest: GroupManifest) => Promise<void>;
  create: (groupManifest: GroupManifest) => Promise<Group>;
}

export class LocalDbGroupRepository implements GroupRepository {
  public fetch = async (identifier: Identifier) => {
    const dbGroup = await DBGroup.findOne({
      where: {
        domain: identifier.domain,
        domainScopedId: identifier.domainScopedId,
      },
    });
    return dbGroup ? dbGroup.toGroup() : null;
  };

  public list = async (identifiers: Identifier[]) => {
    const whereOptions: WhereOptions<DBGroup>[] = identifiers;
    const dbGroupes = await DBGroup.findAll({
      where: { [Op.or]: whereOptions },
    });
    return dbGroupes.map((v) => v.toGroup());
  };

  public update = async (id: number, groupManifest: GroupManifest) => {
    await DBGroup.update({ name: groupManifest.name }, { where: { id } });
  };

  public create = async (groupManifest: GroupManifest): Promise<Group> => {
    const dbGroup = await DBGroup.create({
      domain: groupManifest.domain,
      domainScopedId: groupManifest.domainScopedId,
      name: groupManifest.name,
      autoAddNewBmses: true,
    });

    return dbGroup.toGroup();
  };
}
