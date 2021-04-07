import { DBObservation } from "../adapters/database/models/DBObservation";
import { Observation } from "../models/Observation";

export interface ObservationRepository {
  list: () => Promise<Observation[]>;
  createOrIgnore: (
    updatesManifestUrl: string,
    checkedAt: Date
  ) => Promise<void>;
}

export class LocalDbObservationRepository implements ObservationRepository {
  public list = async () => {
    const observations = await DBObservation.findAll();
    return observations.map((v) => v.toObservation());
  };

  public createOrIgnore = async (
    updatesManifestUrl: string,
    checkedAt: Date
  ) => {
    await DBObservation.findOrCreate({
      where: { manifestUrl: updatesManifestUrl },
      defaults: {
        manifestUrl: updatesManifestUrl,
        checkedAt,
      },
    });
  };
}
