import { Bms as BbsBms } from "@bmssearch/bms-bundle-spec";
import { ResourceSpec } from "./ResourceSpec";
import { urlDomain } from "../utils/url";

export interface BmsSpecAttrs {
  specUrl: string;
  domain: string;
  domainScopedId: string;
  websiteUrl?: string;
  groupSpecUrl?: string;
  updatesSpecUrl?: string;
  resources: ResourceSpec[];
}

export class BmsSpec implements BmsSpecAttrs {
  public specUrl: string;
  public domain: string;
  public domainScopedId: string;
  public websiteUrl?: string;
  public groupSpecUrl?: string;
  public updatesSpecUrl?: string;
  public resources: ResourceSpec[];

  constructor(attrs: BmsSpecAttrs) {
    this.specUrl = attrs.specUrl;
    this.domain = attrs.domain;
    this.domainScopedId = attrs.domainScopedId;
    this.websiteUrl = attrs.websiteUrl;
    this.groupSpecUrl = attrs.groupSpecUrl;
    this.updatesSpecUrl = attrs.updatesSpecUrl;
    this.resources = attrs.resources;
  }

  public static fromSpec = (specUrl: string, spec: BbsBms): BmsSpec => {
    const resources = spec.resources.map((res) => ResourceSpec.fromSpec(res));
    return new BmsSpec({
      specUrl,
      domain: urlDomain(specUrl),
      domainScopedId: spec.id,
      websiteUrl: spec.website_url,
      groupSpecUrl: spec.group_url,
      updatesSpecUrl: spec.updates_url,
      resources,
    });
  };
}
