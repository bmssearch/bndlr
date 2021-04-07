import {
  CrossDomainIdentifierFactory,
  IdentityFactory,
} from "../models/Identity";

import { GroupManifest } from "../models/GroupManifest";
import { GroupManifestRepository } from "../repositories/GroupManifestRepository";
import { GroupRepository } from "../repositories/GroupRepository";

export class GroupRegistrar {
  constructor(
    private groupManifestRepository: GroupManifestRepository,
    private groupRepository: GroupRepository
  ) {}

  public register = async (groupManifest: GroupManifest) => {
    const cdIdentifierFactory = new CrossDomainIdentifierFactory([
      ["bmssearch.net", "venue.bmssearch.net", "ringo.com"],
    ]);
    const identityFactory = new IdentityFactory(cdIdentifierFactory);

    const identity = identityFactory.create(
      {
        domain: groupManifest.domain,
        domainScopedId: groupManifest.domainScopedId,
      },
      [{ domain: "ringo.com", domainScopedId: "didid" }]
    );

    const groups = await this.groupRepository.list(
      identity.listAllIdentifiers()
    );
    let group = identity.pickClosest(groups, (group) => group.domain);
    if (group) {
      if (identity.own.isIdenticalDomain(group.domain)) {
        await this.groupRepository.update(group.id, groupManifest);
      }
    } else {
      group = await this.groupRepository.create(groupManifest);
    }

    return group;
  };
}
