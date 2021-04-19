import { ManifestInvalidError, RequestError } from "../models/errors";
import nodeFetch, { Response } from "node-fetch";

import { BmsManifest } from "../models/BmsManifest";
import { BmsManifestHelper } from "@bmssearch/bms-bundle-manifest";
import { Identifier } from "../models/Identity";
import { ResourceManifest } from "../models/ResourceManifest";
import { urlDomain } from "../utils/url";

export interface BmsManifestRepository {
  fetch: (manifestUrl: string) => Promise<BmsManifest>;
}

export class NetworkBmsManifestRepository implements BmsManifestRepository {
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
        `「${manifestUrl}」のマニフェスト取得に失敗しました。\n${res.statusText}`
      );
    }

    let json: any;
    try {
      json = await res.json();
    } catch (err) {
      throw new ManifestInvalidError("有効なJSONではありませんでした", err);
    }

    try {
      const bms = BmsManifestHelper.cast(json);

      const resources = bms.resources.map(
        (r) =>
          new ResourceManifest({
            url: r.url,
            type: r.type,
            updatedAt: r.updated_at ? new Date(r.updated_at) : undefined,
            name: r.name,
          })
      );

      const aliases: Identifier[] | undefined = bms.aliases?.map((a) => ({
        domain: a.domain,
        domainScopedId: a.id,
      }));

      return new BmsManifest({
        manifestUrl,
        domain: urlDomain(manifestUrl),
        domainScopedId: bms.id,
        aliases,
        title: bms.title,
        websiteUrl: bms.website_url,
        groupManifestUrls: bms.group_manifest_urls,
        updatesManifestUrl: bms.updates_manifest_url,
        resources,
      });
    } catch (err) {
      throw new ManifestInvalidError(err.message, err);
    }
  };
}

export class MockBmsManifestRepository implements BmsManifestRepository {
  constructor(private bmsManifest: BmsManifest) {}

  public fetch = async () => {
    return this.bmsManifest;
  };
}
