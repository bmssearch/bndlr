export interface BmsCheckAttrs {
  domain: string;
  domainScopedId: string;
  checkedAt: Date;
}

export class BmsCheck implements BmsCheckAttrs {
  public domain: string;
  public domainScopedId: string;
  public checkedAt: Date;

  constructor(attrs: BmsCheckAttrs) {
    this.domain = attrs.domain;
    this.domainScopedId = attrs.domainScopedId;
    this.checkedAt = attrs.checkedAt;
  }
}
