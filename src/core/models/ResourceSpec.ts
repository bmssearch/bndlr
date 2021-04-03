import { BmsResource as BbsBmsResource } from "@bmssearch/bms-bundle-spec";

export interface ResourceSpecAttrs {
  url: string;
  type: "core" | "patch" | "additional";
  updatedAt?: Date;
  name?: string;
}

export class ResourceSpec implements ResourceSpecAttrs {
  public url: string;
  public type: "core" | "patch" | "additional";
  public updatedAt?: Date;
  public name?: string;

  constructor(attrs: ResourceSpecAttrs) {
    this.url = attrs.url;
    this.type = attrs.type;
    this.updatedAt = attrs.updatedAt;
    this.name = attrs.name;
  }

  public static fromSpec = (spec: BbsBmsResource): ResourceSpec => {
    return {
      url: spec.url,
      type: spec.type,
      updatedAt:
        spec.updated_at !== undefined ? new Date(spec.updated_at) : undefined,
      name: spec.name,
    };
  };
}
