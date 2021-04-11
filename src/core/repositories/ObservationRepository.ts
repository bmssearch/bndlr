import { Observation } from "../models/Observation";

export interface ObservationRepository {
  list: () => Promise<Observation[]>;
  check: (manifestUrl: string, checkedAt: Date) => Promise<void>;
  createOrIgnore: (
    updatesManifestUrl: string,
    checkedAt: Date
  ) => Promise<void>;
}
