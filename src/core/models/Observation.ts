export interface ObservationAttrs {
  manifestUrl: string;
  checkedAt: Date;
}

export class Observation implements ObservationAttrs {
  public manifestUrl: string;
  public checkedAt: Date;

  constructor(attrs: ObservationAttrs) {
    this.manifestUrl = attrs.manifestUrl;
    this.checkedAt = attrs.checkedAt;
  }
}
