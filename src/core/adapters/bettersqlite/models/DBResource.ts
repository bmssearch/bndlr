import { Bms } from "../../../models/Bms";
import { Resource } from "../../../models/Resource";

export interface DBResource {
  id: number;
  bmsId: number;
  url: string;
  type: "core" | "patch" | "additional";
  updatedAt?: string;
}

export const dbToResource = (db: DBResource, bms: Bms): Resource => {
  return new Resource({
    id: db.id,
    bms,
    url: db.url,
    type: db.type,
    updatedAt: db.updatedAt ? new Date(db.updatedAt) : undefined,
  });
};
