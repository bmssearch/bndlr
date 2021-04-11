import {
  DBObservation,
  dbToObservation,
} from "../../adapters/bettersqlite/models/DBObservation";

import { ObservationRepository } from "../ObservationRepository";
import { db } from "../../adapters/bettersqlite";

export class BetterSqliteObservationRepository
  implements ObservationRepository {
  public list = async () => {
    const st = db.prepare("SELECT * FROM observations");
    const dbObservations: DBObservation[] = st.all();
    const observations = dbObservations.map(dbToObservation);
    return observations;
  };

  public check = async (manifestUrl: string, checkedAt: Date) => {
    const st = db.prepare(
      "UPDATE observations SET checkedAt = ? WHERE manifestUrl = ?"
    );
    st.run(checkedAt.toISOString(), manifestUrl);
  };

  public createOrIgnore = async (
    updatesManifestUrl: string,
    checkedAt: Date
  ) => {
    const st = db.prepare(
      "INSERT OR IGNORE INTO observations (manifestUrl, checkedAt) VALUES (?, ?)"
    );
    st.run(updatesManifestUrl, checkedAt.toISOString());
  };
}
