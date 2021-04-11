import { Op, WhereOptions } from "sequelize";

import { Bms } from "../../models/Bms";
import { BmsManifest } from "../../models/BmsManifest";
import { BmsRepository } from "../BmsRepository";
import { DBBms } from "../../adapters/sequelize/models/DBBms";
import { Identifier } from "../../models/Identity";

export class SequelizeBmsRepository implements BmsRepository {
  public list = async (identifiers: Identifier[]) => {
    const whereOptions: WhereOptions<DBBms>[] = identifiers;
    const dbBmses = await DBBms.findAll({ where: { [Op.or]: whereOptions } });
    return dbBmses.map((v) => v.toBms());
  };

  public update = async (id: number, bmsManifest: BmsManifest) => {
    await DBBms.update({ title: bmsManifest.title }, { where: { id } });
  };

  public create = async (bmsManifest: BmsManifest): Promise<Bms> => {
    const dbBms = await DBBms.create({
      domain: bmsManifest.domain,
      domainScopedId: bmsManifest.domainScopedId,
      title: bmsManifest.title,
    });
    return dbBms.toBms();
  };
}
