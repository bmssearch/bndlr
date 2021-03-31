export interface BmsAttrs {
  id: number;
  domain: string;
  domainScopedId: string;
  specUrl: string;
  checkedAt: Date;
}

export class Bms implements BmsAttrs {
  public id: number;
  public domain: string;
  public domainScopedId: string;
  public specUrl: string;
  public checkedAt: Date;

  constructor(attrs: BmsAttrs) {
    this.id = attrs.id;
    this.domain = attrs.domain;
    this.domainScopedId = attrs.domainScopedId;
    this.specUrl = attrs.specUrl;
    this.checkedAt = attrs.checkedAt;
  }
}
