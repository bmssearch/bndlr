import { DBObservation } from "../adapters/database/models/DBObservation";

export interface ObservationRepository {
  createOrIgnore: (updatesSpecUrl: string, checkedAt: Date) => Promise<void>;
}

export class LocalDbObservationRepository implements ObservationRepository {
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
