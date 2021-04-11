import { Bms } from "../../../models/Bms";

export interface DBBms {
  id: number;
  domain: string;
  domainScopedId: string;
  title: string;
}

export const dbToBms = (db: DBBms): Bms => {
  return new Bms({
    id: db.id,
    domain: db.domain,
    domainScopedId: db.domainScopedId,
    title: db.title,
  });
};
