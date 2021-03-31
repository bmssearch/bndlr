import { BmsSpec } from "../models/BmsSpec";
import { BmsSpecParser } from "../bbs/bms_spec_reader";
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

const SHOULD_DOWNLOAD_PATCHES = false;
const SHOULD_DOWNLOAD_ADDITIONALS = false;

export const checkUpdates = async (specUrl: string): Promise<void> => {
  console.log("START");

  // まずはリモートからyamlをとってくる
  // const spec = new BmsSpecParser().parse({ version: 1 });

  const bmsSpecUrls = ["https://wetwet", "https://werwerw"];
};
