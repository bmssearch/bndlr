export interface ResourceAttrs {
  id: number;
  bmsId: number;
  url: string;
  type: "core" | "patch" | "additional";
}

export class Resource {
  public id: number;
  public bmsId: number;
  public url: string;
  public type: "core" | "patch" | "additional";

  constructor(attrs: ResourceAttrs) {
    this.id = attrs.id;
    this.bmsId = attrs.bmsId;
    this.url = attrs.url;
    this.type = attrs.type;
  }
}
