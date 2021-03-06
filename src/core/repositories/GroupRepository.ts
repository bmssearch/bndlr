import { Group } from "../models/Group";
import { GroupManifest } from "../models/GroupManifest";
import { Identifier } from "../models/Identity";

export interface GroupRepository {
  fetch: (identifier: Identifier) => Promise<Group | null>;
  list: (identifiers: Identifier[]) => Promise<Group[]>;
  all: () => Promise<Group[]>;

  update: (
    id: number,
    groupManifest: GroupManifest,
    autoAddNewBmses?: boolean
  ) => Promise<void>;
  create: (
    groupManifest: GroupManifest,
    autoInstallNewBmses: boolean
  ) => Promise<Group>;

  addBms: (groupId: number, bmsId: number) => Promise<void>;
}
