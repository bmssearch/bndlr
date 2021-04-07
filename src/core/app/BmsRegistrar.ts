import {
  CrossDomainIdentifierFactory,
  Identity,
  IdentityFactory,
} from "../models/Identity";

import { BmsCheckRepository } from "../repositories/BmsCheckRepository";
import { BmsManifest } from "../models/BmsManifest";
import { BmsManifestRepository } from "../repositories/BmsManifestRepository";
import { BmsRepository } from "../repositories/BmsRepository";

export class BmsRegistrar {
  constructor(
    private bmsManifestRepository: BmsManifestRepository,
    private bmsRepository: BmsRepository,
    private bmsCheckRepository: BmsCheckRepository
  ) {}

  public register = async (bmsManifest: BmsManifest) => {
    const cdIdentifierFactory = new CrossDomainIdentifierFactory([
      ["bmssearch.net", "venue.bmssearch.net", "ringo.com"],
    ]);
    const identityFactory = new IdentityFactory(cdIdentifierFactory);

    const identity = identityFactory.create(
      {
        domain: bmsManifest.domain,
        domainScopedId: bmsManifest.domainScopedId,
      },
      [{ domain: "ringo.com", domainScopedId: "didid" }]
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
