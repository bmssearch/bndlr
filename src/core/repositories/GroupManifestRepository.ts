import { ManifestInvalidError, RequestError } from "../models/errors";
import nodeFetch, { Response } from "node-fetch";

import { GroupManifest } from "../models/GroupManifest";
import { GroupManifest as GroupManifestLib } from "@bmssearch/bms-bundle-manifest";

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
      const group = GroupManifestLib.cast(json);
      const manifest = GroupManifest.fromRawManifest(manifestUrl, group);
      return manifest;
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
