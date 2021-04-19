import { Identifier } from "./Identity";

export interface GroupManifestAttrs {
  manifestUrl: string;
  domain: string;
  domainScopedId: string;
  aliases?: Identifier[];
  name: string;
  websiteUrl?: string;
  updatesManifestUrl?: string;
  bmses?: GroupManifestBms[];
}

export interface GroupManifestBms {
  domain: string;
  domainScopedId: string;
  manifestUrl: string;
}

export class GroupManifest implements GroupManifestAttrs {
  manifestUrl: string;
  domain: string;
  domainScopedId: string;
  aliases?: Identifier[];
  name: string;
  websiteUrl?: string;
  updatesManifestUrl?: string;
  bmses?: GroupManifestBms[];

  constructor(attrs: GroupManifestAttrs) {
    this.manifestUrl = attrs.manifestUrl;
    this.domain = attrs.domain;
    this.domainScopedId = attrs.domainScopedId;
    this.aliases = attrs.aliases;
    this.name = attrs.name;
    this.websiteUrl = attrs.websiteUrl;
    this.updatesManifestUrl = attrs.updatesManifestUrl;
    this.bmses = attrs.bmses;
  }
}
