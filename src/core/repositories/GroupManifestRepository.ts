import { GroupManifest, GroupManifestBms } from "../models/GroupManifest";
import { ManifestInvalidError, RequestError } from "../models/errors";
import nodeFetch, { Response } from "node-fetch";

import { GroupManifestHelper } from "@bmssearch/bms-bundle-manifest";
import { Identifier } from "../models/Identity";
import { urlDomain } from "../utils/url";

export interface GroupManifestRepository {
  fetch: (manifestUrl: string) => Promise<GroupManifest>;
}

export class NetworkGroupManifestRepository implements GroupManifestRepository {
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
      const group = GroupManifestHelper.cast(json);

      const bmses = group.bmses?.map(
        (bms): GroupManifestBms => ({
          domain: urlDomain(manifestUrl),
          domainScopedId: bms.id,
          manifestUrl: bms.manifest_url,
        })
      );

      const aliases: Identifier[] | undefined = group.aliases?.map((a) => ({
        domain: a.domain,
        domainScopedId: a.id,
      }));

      return new GroupManifest({
        manifestUrl,
        domain: urlDomain(manifestUrl),
        domainScopedId: group.id,
        aliases,
        name: group.name,
        websiteUrl: group.website_url,
        updatesManifestUrl: group.updates_manifest_url,
        bmses,
      });
    } catch (err) {
      throw new ManifestInvalidError(err.message, err);
    }
  };
}

export class MockGroupManifestRepository implements GroupManifestRepository {
  constructor(private GroupManifest: GroupManifest) {}

  public fetch = async () => {
    return this.GroupManifest;
  };
}
