import { Bms } from "../core/models/Bms";
import { BmsManifest } from "../core/models/BmsManifest";
import { GroupManifest } from "../core/models/GroupManifest";
import { Installation } from "../core/models/Installation";
import { Resource } from "../core/models/Resource";
import { UpdatesManifest } from "../core/models/UpdatesManifest";

export const mockBmsManifest: BmsManifest = {
  manifestUrl: "manifestUrl",
  domain: "venue.bmssearch.net",
  domainScopedId: "test_id3",
  title: "Falling Cxte",
  groupManifestUrls: ["https://venue.bmssearch.net/bmsshuin3/bbs"],
  updatesManifestUrl: "https://venue.bmssearch.net/boots_updates2",
  resources: [
    {
      name: "通常版",
      url: "https://www.dropbox.com/s/magw392fp7n5v0w/Falling%20Cxte.zip?dl=0",
      type: "core",
      updatedAt: new Date(),
    },
    {
      name: "rar版",
      url:
        "https://www.dropbox.com/s/02ex1ftmpkaif26/45_ryu0316_konosora_ogg.rar",
      type: "core",
    },
    {
      name: "だばぁ版",
      url: "https://www.dropbox.com/s/dinxpqj7s2b0m9o/clutter.zip?dl=0",
      type: "additional",
      updatedAt: new Date(),
    },
  ],
};

export const mockGroupManifest = new GroupManifest({
  manifestUrl: "https://bmssearch.net/aa",
  domain: "bmssearch.net",
  domainScopedId: "id in bmssearch.ent2",
  name: "すごいプレイリスト2",
  websiteUrl: "website",
  updatesManifestUrl: "erer",
  bmses: [
    {
      domain: "bmssearch.net",
      domainScopedId: "aer",
      manifestUrl: "werwerwre",
    },
  ],
});

export const mockUpdatesManifest = new UpdatesManifest({
  bmses: [
    {
      domain: "bmssearch.net",
      domainScopedId: "id",
      manifestUrl: "https://bmssearch.net/werwer",
      domainScopedGroupIds: ["werwer"],
      updatedAt: new Date(),
    },
    {
      domain: "venue.bmssearch.net",
      domainScopedId: "test_id3",
      manifestUrl: "https://bmssearch.net/werwer",
      domainScopedGroupIds: ["werwer"],
      updatedAt: new Date(),
    },
  ],
});

export const mockBms: Bms = new Bms({
  id: 1,
  domain: "ni",
  domainScopedId: "san",
  title: "si",
});

export const mockResource: Resource = new Resource({
  id: 1,
  bms: mockBms,
  url: "https://venue.bmssearch.net/boots_updates",
  type: "additional",
});

export const mockInstallation: Installation = new Installation({
  id: 1,
  resource: mockResource,
  status: "proposed",
  createdAt: new Date(),
});
