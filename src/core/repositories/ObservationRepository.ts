import { DBObservation } from "../adapters/database/models/DBObservation";
import { Observation } from "../models/Observation";

export interface ObservationRepository {
  list: () => Promise<Observation[]>;
  createOrIgnore: (updatesSpecUrl: string, checkedAt: Date) => Promise<void>;
}

export class LocalDbObservationRepository implements ObservationRepository {
  public list = async () => {
    const observations = await DBObservation.findAll();
    return observations.map((v) => v.toObservation());
  };

  public createOrIgnore = async (updatesSpecUrl: string, checkedAt: Date) => {
    await DBObservation.findOrCreate({
      where: { specUrl: updatesSpecUrl },
      defaults: {
        specUrl: updatesSpecUrl,
        checkedAt,
      },
    });
  };
}
