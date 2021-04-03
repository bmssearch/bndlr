export interface InstallationHistoryAttrs {
  id: number;
  resourceId: number;
  status: "proposed" | "installed" | "failed" | "skipped";
  checkedAt?: Date;
}

export class InstallationHistory implements InstallationHistoryAttrs {
  public id: number;
  public resourceId: number;
  public status: "proposed" | "installed" | "failed" | "skipped";
  public checkedAt?: Date;

  constructor(attrs: InstallationHistoryAttrs) {
    this.id = attrs.id;
    this.resourceId = attrs.resourceId;
    this.status = attrs.status;
    this.checkedAt = attrs.checkedAt;
  }
}
