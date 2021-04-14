import {
  CrossDomainIdentifierFactory,
  Identity,
  IdentityFactory,
} from "../models/Identity";

import { BmsCheckRepository } from "../repositories/BmsCheckRepository";
import { BmsManifest } from "../models/BmsManifest";
import { BmsRepository } from "../repositories/BmsRepository";
import { PreferencesRepository } from "../repositories/PreferencesRepository";

export class BmsRegistrar {
  constructor(
    private preferencesRepository: PreferencesRepository,
    private bmsRepository: BmsRepository,
    private bmsCheckRepository: BmsCheckRepository
  ) {}

  public register = async (bmsManifest: BmsManifest) => {
    const { identicalDomainsList } = await this.preferencesRepository.get();
    const cdIdentifierFactory = new CrossDomainIdentifierFactory(
      identicalDomainsList
    );
    const identityFactory = new IdentityFactory(cdIdentifierFactory);

    const identity = identityFactory.create(
      {
        domain: bmsManifest.domain,
        domainScopedId: bmsManifest.domainScopedId,
      },
      bmsManifest.aliases
    );

    // register bms
    const bmses = await this.bmsRepository.list(identity.listAllIdentifiers());
    let bms = identity.pickClosest(bmses, (v) => v.domain);
    if (bms) {
      if (identity.own.isIdenticalDomain(bms.domain)) {
        await this.bmsRepository.update(bms.id, bmsManifest);
      }
    } else {
      bms = await this.bmsRepository.create(bmsManifest);
    }

    return bms;
  };

  public updateChecked = async (identity: Identity, checkedAt: Date) => {
    await this.bmsCheckRepository.saveCheckedAt(
      identity.own.listIdentifiers(), // aliasのマニフェストはチェックしていないため
      checkedAt
    );
  };
}
