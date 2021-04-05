import { Resource } from "./Resource";

export type InstallationStatus =
  | "proposed"
  | "installed"
  | "failed"
  | "skipped";

export interface InstallationAttrs {
  id: number;
  resource: Resource;
  status: InstallationStatus;
  checkedAt?: Date;
  createdAt: Date;
}

export class Installation implements InstallationAttrs {
  public id: number;
  public resource: Resource;
  public status: InstallationStatus;
  public checkedAt?: Date;
  public createdAt: Date;

  constructor(attrs: InstallationAttrs) {
    this.id = attrs.id;
    this.resource = attrs.resource;
    this.status = attrs.status;
    this.checkedAt = attrs.checkedAt;
    this.createdAt = attrs.createdAt;
  }
}
