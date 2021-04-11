import { BmsCheck } from "../../../models/BmsCheck";

export interface DBBmsCheck {
  domain: string;
  domainScopedId: string;
  checkedAt: string;
}

export const dbToBmsCheck = (db: DBBmsCheck): BmsCheck => {
  return new BmsCheck({
    domain: db.domain,
    domainScopedId: db.domainScopedId,
    checkedAt: new Date(db.checkedAt),
  });
};
