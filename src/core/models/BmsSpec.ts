import { Bms as BbsBms } from "@bmssearch/bms-bundle-spec";
import { ResourceSpec } from "./ResourceSpec";
import { urlDomain } from "../utils/url";

export interface BmsSpecAttrs {
  specUrl: string;
  domain: string;
  domainScopedId: string;
  title: string;
  websiteUrl?: string;
  groupManifestUrl?: string;
  updatesManifestUrl?: string;
  resources: ResourceSpec[];
}

export class BmsSpec implements BmsSpecAttrs {
  public specUrl: string;
  public domain: string;
  public domainScopedId: string;
  public title: string;
  public websiteUrl?: string;
  public groupManifestUrl?: string;
  public updatesManifestUrl?: string;
  public resources: ResourceSpec[];

  constructor(attrs: BmsSpecAttrs) {
    this.specUrl = attrs.specUrl;
    this.domain = attrs.domain;
    this.domainScopedId = attrs.domainScopedId;
    this.title = attrs.title;
    this.websiteUrl = attrs.websiteUrl;
    this.groupManifestUrl = attrs.groupManifestUrl;
    this.updatesManifestUrl = attrs.updatesManifestUrl;
    this.resources = attrs.resources;
  }

  public static fromSpec = (specUrl: string, spec: BbsBms): BmsSpec => {
    const resources = spec.resources.map((res) => ResourceSpec.fromSpec(res));
    return new BmsSpec({
      specUrl,
      domain: urlDomain(specUrl),
      domainScopedId: spec.id,
      title: "dummy title",
      websiteUrl: spec.website_url,
      groupManifestUrl: spec.group_url,
      updatesManifestUrl: spec.updates_url,
      resources,
    });
  };
}
