import { Op, WhereOptions } from "sequelize";

import { Bms } from "../models/Bms";
import { BmsSpec } from "../models/BmsSpec";
import { DBBms } from "../adapters/database/models/DBBms";
import { Identifier } from "../models/Identity";

export interface BmsRepository {
  list: (identifiers: Identifier[]) => Promise<Bms[]>;

  update: (id: number, bmsManifest: BmsSpec) => Promise<void>;
  create: (bmsManifest: BmsSpec) => Promise<Bms>;
}

export class LocalDbBmsRepository implements BmsRepository {
  public list = async (identifiers: Identifier[]) => {
    const whereOptions: WhereOptions<DBBms>[] = identifiers;
    const dbBmses = await DBBms.findAll({ where: { [Op.or]: whereOptions } });
    return dbBmses.map((v) => v.toBms());
  };

  public update = async (id: number, bmsManifest: BmsSpec) => {
    await DBBms.update({ title: bmsManifest.title }, { where: { id } });
  };

  public create = async (bmsManifest: BmsSpec): Promise<Bms> => {
    const dbBms = await DBBms.create({
      domain: bmsManifest.domain,
      domainScopedId: bmsManifest.domainScopedId,
      title: bmsManifest.title,
    });

    return dbBms.toBms();
  };
}
