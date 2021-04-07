import { GroupManifest } from "../models/GroupManifest";

export interface GroupManifestRepository {
  fetch: (manifestUrl: string) => Promise<GroupManifest>;
}

export class MockGroupManifestRepository implements GroupManifestRepository {
  constructor(private GroupManifest: GroupManifest) {}

  public fetch = async () => {
    return this.GroupManifest;
  };
}
