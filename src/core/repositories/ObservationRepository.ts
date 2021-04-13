import { Observation } from "../models/Observation";

export interface ObservationRepository {
  list: () => Promise<Observation[]>;
  markChecked: (manifestUrl: string, checkedAt: Date) => Promise<void>;
  createOrIgnore: (
    updatesManifestUrl: string,
    checkedAt: Date
  ) => Promise<void>;
}
