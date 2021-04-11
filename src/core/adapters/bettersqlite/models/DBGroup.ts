import { Group } from "../../../models/Group";

export interface DBGroup {
  id: number;
  domain: string;
  domainScopedId: string;
  name: string;
  autoAddNewBmses: boolean;
}

export const dbToGroup = (db: DBGroup): Group => {
  return new Group({
    id: db.id,
    domain: db.domain,
    domainScopedId: db.domainScopedId,
    name: db.name,
    autoDownloadNewBmses: db.autoAddNewBmses,
  });
};
