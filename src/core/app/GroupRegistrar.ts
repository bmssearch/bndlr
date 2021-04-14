import {
  CrossDomainIdentifierFactory,
  IdentityFactory,
} from "../models/Identity";

import { GroupManifest } from "../models/GroupManifest";
import { GroupRepository } from "../repositories/GroupRepository";
import { PreferencesRepository } from "../repositories/PreferencesRepository";

export class GroupRegistrar {
  constructor(
    private preferencesRepository: PreferencesRepository,
    private groupRepository: GroupRepository
  ) {}

  public register = async (
    groupManifest: GroupManifest,
    autoAddNewBmses: boolean
  ) => {
    const { identicalDomainsList } = await this.preferencesRepository.get();
    const cdIdentifierFactory = new CrossDomainIdentifierFactory(
      identicalDomainsList
    );
    const identityFactory = new IdentityFactory(cdIdentifierFactory);

    const identity = identityFactory.create(
      {
        domain: groupManifest.domain,
        domainScopedId: groupManifest.domainScopedId,
      },
      groupManifest.aliases
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
      group = await this.groupRepository.create(groupManifest, autoAddNewBmses);
    }

    return group;
  };
}
