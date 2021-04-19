import { Identifier } from "./Identity";
import { ResourceManifest } from "./ResourceManifest";

export interface BmsManifestAttrs {
  manifestUrl: string;
  domain: string;
  domainScopedId: string;
  aliases?: Identifier[];
  title: string;
  websiteUrl?: string;
  groupManifestUrls?: string[];
  updatesManifestUrl?: string;
  resources: ResourceManifest[];
}

export class BmsManifest implements BmsManifestAttrs {
  public manifestUrl: string;
  public domain: string;
  public domainScopedId: string;
  public aliases?: Identifier[];
  public title: string;
  public websiteUrl?: string;
  public groupManifestUrls?: string[];
  public updatesManifestUrl?: string;
  public resources: ResourceManifest[];

  constructor(attrs: BmsManifestAttrs) {
    this.manifestUrl = attrs.manifestUrl;
    this.domain = attrs.domain;
    this.domainScopedId = attrs.domainScopedId;
    this.title = attrs.title;
    this.aliases = attrs.aliases;
    this.websiteUrl = attrs.websiteUrl;
    this.groupManifestUrls = attrs.groupManifestUrls;
    this.updatesManifestUrl = attrs.updatesManifestUrl;
    this.resources = attrs.resources;
  }
}
