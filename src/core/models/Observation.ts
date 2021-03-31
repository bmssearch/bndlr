export interface ObservationAttrs {
  specUrl: string;
  checkedAt: Date;
}

export class Observation implements ObservationAttrs {
  public specUrl: string;
  public checkedAt: Date;

  constructor(attrs: ObservationAttrs) {
    this.specUrl = attrs.specUrl;
    this.checkedAt = attrs.checkedAt;
  }
}
