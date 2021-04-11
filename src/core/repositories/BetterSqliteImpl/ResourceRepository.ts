import { DBBms, dbToBms } from "../../adapters/bettersqlite/models/DBBms";
import {
  DBResource,
  dbToResource,
} from "../../adapters/bettersqlite/models/DBResource";

import { ResourceManifest } from "../../models/ResourceManifest";
import { ResourceRepository } from "../ResourceRepository";
import { db } from "../../adapters/bettersqlite";

export class BetterSqliteResourceRepository implements ResourceRepository {
  public fetch = async (bmsId: number, url: string) => {
    const st = db.prepare(
      "SELECT * FROM resources WHERE bmsId = ? AND url = ?"
    );
    const dbResource: DBResource | undefined = st.get(bmsId, url);
    if (!dbResource) return null;

    const bst = db.prepare("SELECT * FROM bmses WHERE id = ?");
    const dbBms: DBBms = bst.get(dbResource.bmsId);
    const bms = dbToBms(dbBms);

    return dbToResource(dbResource, bms);
  };

  public save = async (resource: ResourceManifest, bmsId: number) => {
    // bmsId と urlがともに一致するものを同一とみなす

    const st = db.prepare("SELECT * FROM bmses WHERE id = ?");
    const dbBms: DBBms | undefined = st.get(bmsId);

    if (!dbBms) {
      throw Error("no corresponding bms found");
    }

    const rst = db.prepare(
      "SELECT * FROM resources WHERE bmsId = ? AND url = ?"
    );
    const existing: DBResource = rst.get(bmsId, resource.url);

    let id;
    if (existing) {
      const st = db.prepare(
        "UPDATE resources SET url = :url, type = :type, updatedAt = :updatedAt WHERE id = :id"
      );
      st.run({
        id: existing.id,
        url: resource.url,
        type: resource.type,
        updatedAt: resource.updatedAt ? resource.updatedAt.toISOString() : null,
      });
      id = existing.id;
    } else {
      const st = db.prepare(
        "INSERT INTO resources (bmsId, url, type, updatedAt) VALUES (:bmsId, :url, :type, :updatedAt)"
      );
      const info = st.run({
        bmsId,
        url: resource.url,
        type: resource.type,
        updatedAt: resource.updatedAt ? resource.updatedAt.toISOString() : null,
      });
      id = info.lastInsertRowid;
    }

    const gst = db.prepare("SELECT * FROM resources WHERE id = ?");
    const dbResource: DBResource = gst.get(id);

    const bms = dbToBms(dbBms);

    return dbToResource(dbResource, bms);
  };
}
