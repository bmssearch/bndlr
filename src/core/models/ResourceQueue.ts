export interface ResourceQueueAttrs {
  id: number;
  resourceId: number;
  updatedAt: Date;
}

export class ResourceQueue implements ResourceQueueAttrs {
  public id: number;
  public resourceId: number;
  public updatedAt: Date;

  constructor(attrs: ResourceQueueAttrs) {
    this.id = attrs.id;
    this.resourceId = attrs.resourceId;
    this.updatedAt = attrs.updatedAt;
  }
}
