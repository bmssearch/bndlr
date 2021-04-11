import { Observation } from "../../../models/Observation";

export interface DBObservation {
  manifestUrl: string;
  checkedAt: string;
}

export const dbToObservation = (db: DBObservation): Observation => {
  return new Observation({
    manifestUrl: db.manifestUrl,
    checkedAt: new Date(db.checkedAt),
  });
};
