import { Bms } from "../models/Bms";
import { BmsSpec } from "../models/BmsSpec";
import { DBBms } from "../adapters/database/models/DBBms";

export interface BmsRepository {
  save: (bms: BmsSpec, checkedAt: Date) => Promise<Bms>;
}

export class LocalDbBmsRepository implements BmsRepository {
  public save = async (bms: BmsSpec, checkedAt: Date): Promise<Bms> => {
    // domain と domainScopedId をもって同一とみなす

    const existing = await DBBms.findOne({
      where: { domain: bms.domain, domainScopedId: bms.domainScopedId },
    });

    let dbBms: DBBms;
    if (existing) {
      existing.specUrl = bms.specUrl;
      existing.checkedAt = checkedAt;
      dbBms = await existing.save();
    } else {
      dbBms = await DBBms.create({
        domain: bms.domain,
        domainScopedId: bms.domainScopedId,
        title: bms.title,
        specUrl: bms.specUrl,
        checkedAt,
      });
    }

    return dbBms.toBms();
  };
}
