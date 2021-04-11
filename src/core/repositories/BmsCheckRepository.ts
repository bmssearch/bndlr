import { BmsCheck } from "../models/BmsCheck";
import { Identifier } from "../models/Identity";

export interface BmsCheckRepository {
  fetch: (identifier: Identifier) => Promise<BmsCheck | null>;
  saveCheckedAt: (identifiers: Identifier[], checkedAt: Date) => Promise<void>;
}
