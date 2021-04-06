import { UpdatesManifest } from "../models/UpdatesManifest";

export interface UpdatesManifestRepository {
  fetch: (manifestUrl: string) => Promise<UpdatesManifest>;
}

export class MockUpdatesManifestRepository
  implements UpdatesManifestRepository {
  constructor(private UpdatesManifest: UpdatesManifest) {}

  public fetch = async () => {
    return this.UpdatesManifest;
  };
}
