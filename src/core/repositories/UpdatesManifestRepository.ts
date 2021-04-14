import { ManifestInvalidError, RequestError } from "../models/errors";
import nodeFetch, { Response } from "node-fetch";

import { UpdatesManifest as UpdateManifestLib } from "@bmssearch/bms-bundle-manifest";
import { UpdatesManifest } from "../models/UpdatesManifest";

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
      const group = UpdateManifestLib.cast(json);
      const manifest = UpdatesManifest.fromRawManifest(manifestUrl, group);
      return manifest;
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
