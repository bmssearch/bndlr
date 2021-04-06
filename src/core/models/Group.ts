export interface GroupAttrs {
  id: number;
  domain: string;
  domainScopedId: string;
  manifestUrl: string;
  name: string;
  autoDownloadNewBmses: boolean;
}

export class Group implements GroupAttrs {
  public id: number;
  public domain: string;
  public domainScopedId: string;
  public manifestUrl: string;
  public name: string;
  public autoDownloadNewBmses: boolean;

  constructor(attrs: GroupAttrs) {
    this.id = attrs.id;
    this.domain = attrs.domain;
    this.domainScopedId = attrs.domainScopedId;
    this.manifestUrl = attrs.manifestUrl;
    this.name = attrs.name;
    this.autoDownloadNewBmses = attrs.autoDownloadNewBmses;
  }
}
