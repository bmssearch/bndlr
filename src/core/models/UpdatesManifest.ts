import { Updates as BbsUpdates } from "@bmssearch/bms-bundle-spec";
import { urlDomain } from "../utils/url";

export interface UpdatesManifestAttrs {
  timestamp: Date;
  bmses?: UpdatesManifestBms[];
}

interface UpdatesManifestBms {
  domain: string;
  domainScopedId: string;
  manifestUrl: string;
  domainScopedGroupId?: string;
  updatedAt?: Date;
}

export class UpdatesManifest implements UpdatesManifestAttrs {
  timestamp: Date;
  bmses?: UpdatesManifestBms[];

  constructor(attrs: UpdatesManifestAttrs) {
    this.timestamp = attrs.timestamp;
    this.bmses = attrs.bmses;
  }

  public static fromRawManifest = (
    manifestUrl: string,
    raw: BbsUpdates
  ): UpdatesManifest => {
    const domain = urlDomain(manifestUrl);
    const bmses = raw.bmses?.map(
      (bms): UpdatesManifestBms => ({
        domain,
        domainScopedId: bms.id,
        manifestUrl: bms.url,
        domainScopedGroupId: bms.group_id,
        updatedAt: bms.updated_at ? new Date(bms.updated_at) : undefined,
      })
    );

    return new UpdatesManifest({
      timestamp: new Date(raw.timestamp),
      bmses,
    });
  };
}
