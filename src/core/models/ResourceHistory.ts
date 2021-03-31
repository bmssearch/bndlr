export interface ResourceHistoryAttrs {
  id: number;
  resourceId: number;
  result: "installed" | "failed" | "skipped";
  checkedAt: Date;
}

export class ResourceHistory implements ResourceHistoryAttrs {
  public id: number;
  public resourceId: number;
  public result: "installed" | "failed" | "skipped";
  public checkedAt: Date;

  constructor(attrs: ResourceHistoryAttrs) {
    this.id = attrs.id;
    this.resourceId = attrs.resourceId;
    this.result = attrs.result;
    this.checkedAt = attrs.checkedAt;
  }
}
