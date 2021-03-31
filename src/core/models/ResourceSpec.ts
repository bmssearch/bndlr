import { BmsResource as BbsBmsResource } from "@bmssearch/bms-bundle-spec";

export interface ResourceSpecAttrs {
  url: string;
  type: "core" | "patch" | "additional";
  updated_at?: Date;
  name?: string;
}

export class ResourceSpec implements ResourceSpecAttrs {
  public url: string;
  public type: "core" | "patch" | "additional";
  public updated_at?: Date;
  public name?: string;

  constructor(attrs: ResourceSpecAttrs) {
    this.url = attrs.url;
    this.type = attrs.type;
    this.updated_at = attrs.updated_at;
    this.name = attrs.name;
  }

  public static fromSpec = (spec: BbsBmsResource): ResourceSpec => {
    return {
      url: spec.url,
      type: spec.type,
      updated_at:
        spec.updated_at !== undefined ? new Date(spec.updated_at) : undefined,
      name: spec.name,
    };
  };
}
