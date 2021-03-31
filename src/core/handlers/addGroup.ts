import { Downloader } from "../adapters/Downloader";
import { Extractor } from "../adapters/Extractor";
import { ResourceInstaller } from "../adapters/ResourceInstaller";
import { TemporaryDiskProviderFactory } from "../adapters/TemporaryDiskProvider";

const tdpFactory = new TemporaryDiskProviderFactory();
const downloader = new Downloader();
const extractor = new Extractor();
const resourceInstaller = new ResourceInstaller(
  tdpFactory,
  downloader,
  extractor
);

export const addGroup = async (specUrl: string): Promise<void> => {
  console.log("START");

  const bbsGroup = GroupSpec.assert(BBS_GROUP);
  const group = new Group(specUrl, bbsGroup);

  const bmsSpecUrls = group.bbsGroup.bmses?.map((v) => v.url) || [];
};
