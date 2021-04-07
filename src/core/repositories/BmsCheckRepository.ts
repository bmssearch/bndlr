import { Op, WhereOptions } from "sequelize";

import { BmsCheck } from "../models/BmsCheck";
import { DBBmsCheck } from "../adapters/database/models/DBBmsCheck";
import { Identifier } from "../models/Identity";

export interface BmsCheckRepository {
  fetch: (identifier: Identifier) => Promise<BmsCheck | null>;
  saveCheckedAt: (identifiers: Identifier[], checkedAt: Date) => Promise<void>;
}

export class LocalDbBmsCheckRepository implements BmsCheckRepository {
  public fetch = async (identifier: Identifier) => {
    const dbBmsCheck = await DBBmsCheck.findOne({
      where: {
        domain: identifier.domainScopedId,
        domainScopedId: identifier.domainScopedId,
      },
    });
    return dbBmsCheck ? dbBmsCheck.toBmsCheck() : null;
  };

  public saveCheckedAt = async (identifiers: Identifier[], checkedAt: Date) => {
    const whereOptions: WhereOptions<DBBmsCheck>[] = identifiers;
    const existing = await DBBmsCheck.findAll({
      where: { [Op.or]: whereOptions },
    });

    if (existing.length > 0) {
      await DBBmsCheck.update(
        { checkedAt },
        { where: { [Op.or]: whereOptions } }
      );
    } else {
      await DBBmsCheck.bulkCreate(
        identifiers.map((i) => ({
          domain: i.domain,
          domainScopedId: i.domainScopedId,
          checkedAt,
        }))
      );
    }
  };
}
