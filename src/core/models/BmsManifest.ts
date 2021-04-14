import { Bms as BbsBms } from "@bmssearch/bms-bundle-manifest";
import { Identifier } from "./Identity";
import { ResourceManifest } from "./ResourceManifest";
import { urlDomain } from "../utils/url";

export interface BmsManifestAttrs {
  manifestUrl: string;
  domain: string;
  domainScopedId: string;
  aliases?: Identifier[];
  title: string;
  websiteUrl?: string;
  groupManifestUrl?: string;
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
  public groupManifestUrl?: string;
  public updatesManifestUrl?: string;
  public resources: ResourceManifest[];

  constructor(attrs: BmsManifestAttrs) {
    this.manifestUrl = attrs.manifestUrl;
    this.domain = attrs.domain;
    this.domainScopedId = attrs.domainScopedId;
    this.title = attrs.title;
    this.aliases = attrs.aliases;
    this.websiteUrl = attrs.websiteUrl;
    this.groupManifestUrl = attrs.groupManifestUrl;
    this.updatesManifestUrl = attrs.updatesManifestUrl;
    this.resources = attrs.resources;
  }

  public static fromSpec = (manifestUrl: string, spec: BbsBms): BmsManifest => {
    const resources = spec.resources.map((res) =>
      ResourceManifest.fromSpec(res)
    );
    const aliases: Identifier[] | undefined = spec.aliases?.map((a) => ({
      domain: a.domain,
      domainScopedId: a.id,
    }));
    return new BmsManifest({
      manifestUrl,
      domain: urlDomain(manifestUrl),
      domainScopedId: spec.id,
      aliases,
      title: spec.title,
      websiteUrl: spec.website_url,
      groupManifestUrl: spec.group_url,
      updatesManifestUrl: spec.updates_url,
      resources,
    });
  };
}
