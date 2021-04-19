export interface ResourceManifestAttrs {
  url: string;
  type: "core" | "patch" | "additional";
  updatedAt?: Date;
  name?: string;
}

export class ResourceManifest implements ResourceManifestAttrs {
  public url: string;
  public type: "core" | "patch" | "additional";
  public updatedAt?: Date;
  public name?: string;

  constructor(attrs: ResourceManifestAttrs) {
    this.url = attrs.url;
    this.type = attrs.type;
    this.updatedAt = attrs.updatedAt;
    this.name = attrs.name;
  }
}
