import { Bms } from "../models/Bms";
import { BmsManifest } from "../models/BmsManifest";
import { Identifier } from "../models/Identity";

export interface BmsRepository {
  list: (identifiers: Identifier[]) => Promise<Bms[]>;

  update: (id: number, bmsManifest: BmsManifest) => Promise<void>;
  create: (bmsManifest: BmsManifest) => Promise<Bms>;
}
