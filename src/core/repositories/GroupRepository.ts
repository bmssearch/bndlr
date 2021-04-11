import { Group } from "../models/Group";
import { GroupManifest } from "../models/GroupManifest";
import { Identifier } from "../models/Identity";

export interface GroupRepository {
  fetch: (identifier: Identifier) => Promise<Group | null>;
  list: (identifiers: Identifier[]) => Promise<Group[]>;

  update: (id: number, groupManifest: GroupManifest) => Promise<void>;
  create: (groupManifest: GroupManifest) => Promise<Group>;
}
