import { ManifestInvalidError, RequestError } from "../models/errors";
import nodeFetch, { Response } from "node-fetch";

import { BmsManifest } from "../models/BmsManifest";
import { BmsManifest as BmsManifestLib } from "@bmssearch/bms-bundle-manifest";

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
      const bms = BmsManifestLib.assert(json);
      const manifest = BmsManifest.fromSpec(manifestUrl, bms);
      return manifest;
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
