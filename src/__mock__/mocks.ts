import { BmsSpec } from "../core/models/BmsSpec";

export const mockBmsSpec: BmsSpec = {
  specUrl: "specURL",
  domain: "venue.bmssearch.net",
  domainScopedId: "test_id3",
  title: "Falling Cxte",
  groupSpecUrl: "https://venue.bmssearch.net/bmsshuin3/bbs",
  updatesSpecUrl: "https://venue.bmssearch.net/boots_updates",
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
