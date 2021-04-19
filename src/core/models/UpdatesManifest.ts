export interface UpdatesManifestAttrs {
  bmses?: UpdatesManifestBms[];
}

export interface UpdatesManifestBms {
  domain: string;
  domainScopedId: string;
  manifestUrl: string;
  domainScopedGroupIds?: string[];
  updatedAt?: Date;
}

export class UpdatesManifest implements UpdatesManifestAttrs {
  bmses?: UpdatesManifestBms[];

  constructor(attrs: UpdatesManifestAttrs) {
    this.bmses = attrs.bmses;
  }
}
