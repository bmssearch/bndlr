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
  groupManifestUrl: "https://venue.bmssearch.net/bmsshuin3/bbs",
  updatesManifestUrl: "https://venue.bmssearch.net/boots_updates2",
  resources: [
    {
      name: "通常版",
      url: "https://www.dropbox.com/s/magw392fp7n5v0w/Falling%20Cxte.zip?dl=1",
      type: "core",
      updatedAt: new Date(),
    },
    {
      name: "Drive版",
      url:
        "https://drive.google.com/file/d/1BnrKVdL3d9aGwb8pUiT-efut9zxz73H-/view?usp=sharing",
      type: "core",
    },
    {
      name: "Drive版",
      url:
        "https://drive.google.com/file/d/1BnrKVdL3d9aGwb8pUiT-efut9zxz73H-/view?usp=sharing2",
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
  timestamp: new Date(),
  bmses: [
    {
      domain: "bmssearch.net",
      domainScopedId: "id",
      manifestUrl: "https://bmssearch.net/werwer",
      domainScopedGroupId: "werwer",
      updatedAt: new Date(),
    },
    {
      domain: "venue.bmssearch.net",
      domainScopedId: "test_id3",
      manifestUrl: "https://bmssearch.net/werwer",
      domainScopedGroupId: "werwer",
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
