import { ManifestInvalidError, RequestError } from "../models/errors";
import { UpdatesManifest, UpdatesManifestBms } from "../models/UpdatesManifest";
import nodeFetch, { Response } from "node-fetch";

import { UpdatesManifestHelper } from "@bmssearch/bms-bundle-manifest";
import { urlDomain } from "../utils/url";

export interface UpdatesManifestRepository {
  fetch: (manifestUrl: string) => Promise<UpdatesManifest>;
}

export class NetworkUpdatesManifestRepository
  implements UpdatesManifestRepository {
  public fetch = async (manifestUrl: string) => {
    let res: Response;
    try {
      res = await nodeFetch(manifestUrl);
    } catch (err) {
      throw new RequestError(
        `「${manifestUrl}」のマニフェスト取得に失敗しました。\n${err.message}`,
        err
      );
    }

    if (!res.ok) {
      throw new RequestError(
        `「${manifestUrl} 」のマニフェスト取得に失敗しました。\n${res.statusText}`
      );
    }

    let json: any;
    try {
      json = await res.json();
    } catch (err) {
      throw new ManifestInvalidError("有効なJSONではありませんでした", err);
    }

    try {
      const updates = UpdatesManifestHelper.cast(json);
      const domain = urlDomain(manifestUrl);

      const bmses = updates.bmses?.map(
        (bms): UpdatesManifestBms => ({
          domain,
          domainScopedId: bms.id,
          manifestUrl: bms.manifest_url,
          domainScopedGroupIds: bms.group_ids,
          updatedAt: bms.updated_at ? new Date(bms.updated_at) : undefined,
        })
      );

      return new UpdatesManifest({
        bmses,
      });
    } catch (err) {
      throw new ManifestInvalidError(err.message, err);
    }
  };
}

export class MockUpdatesManifestRepository
  implements UpdatesManifestRepository {
  constructor(private UpdatesManifest: UpdatesManifest) {}

  public fetch = async () => {
    return this.UpdatesManifest;
  };
}
