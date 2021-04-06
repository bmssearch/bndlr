import { GroupManifest } from "../models/GroupManifest";

export interface GroupManifestRepository {
  fetch: (manifestUrl: string) => Promise<GroupManifest>;
}

// export class HttpsGroupManifestRepository implements GroupManifestRepository {
//   public fetch = (specUrl: string) => {
// const bbsGroupManifest = BbsGroupManifest.assert(rawSpec);
// const GroupManifest = GroupManifest.fromSpec(specUrl, bbsGroupManifest);
//     return;
//   };
// }

export class MockGroupManifestRepository implements GroupManifestRepository {
  constructor(private GroupManifest: GroupManifest) {}

  public fetch = async () => {
    return this.GroupManifest;
  };
}
