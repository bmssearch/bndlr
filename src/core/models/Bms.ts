export interface BmsAttrs {
  id: number;
  domain: string;
  domainScopedId: string;
  title: string;
}

export class Bms implements BmsAttrs {
  public id: number;
  public domain: string;
  public domainScopedId: string;
  public title: string;

  constructor(attrs: BmsAttrs) {
    this.id = attrs.id;
    this.domain = attrs.domain;
    this.domainScopedId = attrs.domainScopedId;
    this.title = attrs.title;
  }
}
