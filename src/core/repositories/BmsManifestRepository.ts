import { BmsManifest } from "../models/BmsManifest";

export interface BmsManifestRepository {
  fetch: (manifestUrl: string) => Promise<BmsManifest>;
}

export class MockBmsManifestRepository implements BmsManifestRepository {
  constructor(private bmsManifest: BmsManifest) {}

  public fetch = async () => {
    return this.bmsManifest;
  };
}
