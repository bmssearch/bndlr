import { Bms } from "./Bms";

export type ResourceType = "core" | "patch" | "additional";

export interface ResourceAttrs {
  id: number;
  bms: Bms;
  name?: string;
  url: string;
  type: ResourceType;
  updatedAt?: Date;
}

export class Resource implements ResourceAttrs {
  public id: number;
  public bms: Bms;
  public name?: string;
  public url: string;
  public type: ResourceType;
  public updatedAt?: Date;

  constructor(attrs: ResourceAttrs) {
    this.id = attrs.id;
    this.bms = attrs.bms;
    this.name = attrs.name;
    this.url = attrs.url;
    this.type = attrs.type;
    this.updatedAt = attrs.updatedAt;
  }
}
