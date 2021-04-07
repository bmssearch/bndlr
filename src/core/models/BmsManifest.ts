import { Bms as BbsBms } from "@bmssearch/bms-bundle-spec";
import { ResourceManifest } from "./ResourceManifest";
import { urlDomain } from "../utils/url";

export interface BmsManifestAttrs {
  manifestUrl: string;
  domain: string;
  domainScopedId: string;
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
    this.websiteUrl = attrs.websiteUrl;
    this.groupManifestUrl = attrs.groupManifestUrl;
    this.updatesManifestUrl = attrs.updatesManifestUrl;
    this.resources = attrs.resources;
  }

  public static fromSpec = (manifestUrl: string, spec: BbsBms): BmsManifest => {
    const resources = spec.resources.map((res) =>
      ResourceManifest.fromSpec(res)
    );
    return new BmsManifest({
      manifestUrl,
      domain: urlDomain(manifestUrl),
      domainScopedId: spec.id,
      title: "dummy title",
      websiteUrl: spec.website_url,
      groupManifestUrl: spec.group_url,
      updatesManifestUrl: spec.updates_url,
      resources,
    });
  };
}
