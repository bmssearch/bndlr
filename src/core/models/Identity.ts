export interface Identifier {
  domain: string;
  domainScopedId: string;
}

class CrossDomainIdentifier {
  constructor(
    public readonly identifier: Identifier,
    public readonly identicalDomains: string[]
  ) {}

  public listIdentifiers = () => {
    return [this.identifier].concat(
      this.identicalDomains.map((v) => ({
        domain: v,
        domainScopedId: this.identifier.domainScopedId,
      }))
    );
  };

  public isIdenticalDomain = (domain: string) => {
    return (
      this.identifier.domain === domain ||
      this.identicalDomains.includes(domain)
    );
  };
}

export class CrossDomainIdentifierFactory {
  constructor(private identicalDomainSetList: string[][]) {}

  public create = (identifier: Identifier) => {
    const identicalDomains = this.identicalDomainSetList
      .filter((set) => set.includes(identifier.domain))
      .flat()
      .filter((v) => v !== identifier.domain);
    return new CrossDomainIdentifier(identifier, identicalDomains);
  };
}

export class Identity {
  constructor(
    public own: CrossDomainIdentifier,
    public aliases?: CrossDomainIdentifier[]
  ) {}

  public listAllIdentifiers = () => {
    const mainIdentifiers = this.own.listIdentifiers();
    const aliasIdentifiers = this.aliases
      ? this.aliases.map((v) => v.listIdentifiers()).flat()
      : [];
    return mainIdentifiers.concat(aliasIdentifiers);
  };

  public pickClosest = <T>(
    entities: T[],
    domainExtractor: (entity: T) => string
  ) => {
    if (entities.length === 0) return null;

    const exactDomainEntity = entities.find(
      (entity) => domainExtractor(entity) === this.own.identifier.domain
    );
    if (exactDomainEntity) return exactDomainEntity;

    const set = new Set(this.own.identicalDomains);
    const identicalDomainEntity = entities.find((entity) =>
      set.has(domainExtractor(entity))
    );
    if (identicalDomainEntity) return identicalDomainEntity;

    return entities[0];
  };
}

export class IdentityFactory {
  constructor(
    private crossDomainIdentifierFactory: CrossDomainIdentifierFactory
  ) {}

  public create = (identifier: Identifier, aliases?: Identifier[]) => {
    const cdIdentifier = this.crossDomainIdentifierFactory.create(identifier);
    const cdAliases = aliases?.map((alias) =>
      this.crossDomainIdentifierFactory.create(alias)
    );
    return new Identity(cdIdentifier, cdAliases);
  };
}
