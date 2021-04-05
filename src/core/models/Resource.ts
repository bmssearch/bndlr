import { Bms } from "./Bms";

export interface ResourceAttrs {
  id: number;
  bms: Bms;
  url: string;
  type: "core" | "patch" | "additional";
  updatedAt?: Date;
}

export class Resource implements ResourceAttrs {
  public id: number;
  public bms: Bms;
  public url: string;
  public type: "core" | "patch" | "additional";
  public updatedAt?: Date;

  constructor(attrs: ResourceAttrs) {
    this.id = attrs.id;
    this.bms = attrs.bms;
    this.url = attrs.url;
    this.type = attrs.type;
    this.updatedAt = attrs.updatedAt;
  }
}
