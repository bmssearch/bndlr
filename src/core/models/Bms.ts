export interface BmsAttrs {
  id: number;
  domain: string;
  domainScopedId: string;
  title: string;
  specUrl: string;
  checkedAt: Date;
}

export class Bms implements BmsAttrs {
  public id: number;
  public domain: string;
  public domainScopedId: string;
  public title: string;
  public specUrl: string;
  public checkedAt: Date;

  constructor(attrs: BmsAttrs) {
    this.id = attrs.id;
    this.domain = attrs.domain;
    this.domainScopedId = attrs.domainScopedId;
    this.title = attrs.title;
    this.specUrl = attrs.specUrl;
    this.checkedAt = attrs.checkedAt;
  }
}
