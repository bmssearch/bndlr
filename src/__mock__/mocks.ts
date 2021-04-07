import { BmsSpec } from "../core/models/BmsSpec";
import { GroupManifest } from "../core/models/GroupManifest";
import { UpdatesManifest } from "../core/models/UpdatesManifest";

export const mockBmsSpec: BmsSpec = {
  specUrl: "specURL",
  domain: "venue.bmssearch.net",
  domainScopedId: "test_id3",
  title: "Falling Cxte",
  groupManifestUrl: "https://venue.bmssearch.net/bmsshuin3/bbs",
  updatesManifestUrl: "https://venue.bmssearch.net/boots_updates",
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

export const mockBbsBmsSpec = {
  version: 1,

  id: "test_id3",
  group_url: "https://venue.bmssearch.net/bmsshuin3/bbs",
  updates_url: "https://venue.bmssearch.net/boots_updates",
  resources: [
    {
      name: "通常版",
      url: "https://www.dropbox.com/s/magw392fp7n5v0w/Falling%20Cxte.zip?dl=1",
      type: "core",
    },
    {
      name: "Drive版",
      url:
        "https://drive.google.com/file/d/1BnrKVdL3d9aGwb8pUiT-efut9zxz73H-/view?usp=sharing",
      type: "core",
      updated_at: 300,
    },
    {
      name: "Drive版",
      url:
        "https://drive.google.com/file/d/1BnrKVdL3d9aGwb8pUiT-efut9zxz73H-/view?usp=sharing2",
      type: "additional",
      updated_at: 200,
    },
  ],
};

export const mockGroupManifest = new GroupManifest({
  manifestUrl: "https://bmssearch.net/aa",
  domain: "bmssearch.net",
  domainScopedId: "id in bmssearch.ent",
  name: "すごいプレイリスト",
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
