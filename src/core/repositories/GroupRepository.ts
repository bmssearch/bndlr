import { DBGroup } from "../adapters/database/models/DBGroup";
import { Group } from "../models/Group";
import { GroupManifest } from "../models/GroupManifest";

export interface GroupRepository {
  fetch: (domain: string, domainScopedGroupId: string) => Promise<Group | null>;
  save: (
    groupManifest: GroupManifest,
    autoAddNewBmses: boolean
  ) => Promise<Group>;
}

export class LocalDbGroupRepository implements GroupRepository {
  public fetch = async (domain: string, domainScopedId: string) => {
    const dbGroup = await DBGroup.findOne({
      where: { domain, domainScopedId },
    });
    return dbGroup ? dbGroup.toGroup() : null;
  };

  public save = async (
    groupManifest: GroupManifest,
    autoAddNewBmses: boolean
  ): Promise<Group> => {
    // domain と domainScopedId をもって同一とみなす

    const existing = await DBGroup.findOne({
      where: {
        domain: groupManifest.domain,
        domainScopedId: groupManifest.domainScopedId,
      },
    });

    let dbGroup: DBGroup;
    if (existing) {
      existing.manifestUrl = groupManifest.manifestUrl;
      existing.name = groupManifest.name;
      existing.autoAddNewBmses = autoAddNewBmses;
      dbGroup = await existing.save();
    } else {
      dbGroup = await DBGroup.create({
        manifestUrl: groupManifest.manifestUrl,
        domain: groupManifest.domain,
        domainScopedId: groupManifest.domainScopedId,
        name: groupManifest.name,
        autoAddNewBmses,
      });
    }

    return dbGroup.toGroup();
  };
}
