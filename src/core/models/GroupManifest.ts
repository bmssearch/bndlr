import { Group as BbsGroup } from "@bmssearch/bms-bundle-manifest";
import { Identifier } from "./Identity";
import { urlDomain } from "../utils/url";

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

interface GroupManifestBms {
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

  public static fromRawManifest = (
    manifestUrl: string,
    raw: BbsGroup
  ): GroupManifest => {
    const bmses = raw.bmses?.map(
      (bms): GroupManifestBms => ({
        domain: urlDomain(manifestUrl),
        domainScopedId: bms.id,
        manifestUrl: bms.url,
      })
    );
    const aliases: Identifier[] | undefined = raw.aliases?.map((a) => ({
      domain: a.domain,
      domainScopedId: a.id,
    }));
    return new GroupManifest({
      manifestUrl,
      domain: urlDomain(manifestUrl),
      domainScopedId: raw.id,
      aliases,
      name: raw.name,
      websiteUrl: raw.website_url,
      updatesManifestUrl: raw.updates_url,
      bmses,
    });
  };
}
