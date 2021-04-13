import {
  DBObservation,
  dbToObservation,
} from "../../adapters/bettersqlite/models/DBObservation";

import { DatabaseConnector } from "../../adapters/bettersqlite";
import { ObservationRepository } from "../ObservationRepository";

export class BetterSqliteObservationRepository
  implements ObservationRepository {
  constructor(private dbc: DatabaseConnector) {}

  public list = async () => {
    const st = this.dbc.db().prepare("SELECT * FROM observations");
    const dbObservations: DBObservation[] = st.all();
    const observations = dbObservations.map(dbToObservation);
    return observations;
  };

  public markChecked = async (manifestUrl: string, checkedAt: Date) => {
    const st = this.dbc
      .db()
      .prepare("UPDATE observations SET checkedAt = ? WHERE manifestUrl = ?");
    st.run(checkedAt.toISOString(), manifestUrl);
  };

  public createOrIgnore = async (
    updatesManifestUrl: string,
    checkedAt: Date
  ) => {
    const st = this.dbc
      .db()
      .prepare(
        "INSERT OR IGNORE INTO observations (manifestUrl, checkedAt) VALUES (?, ?)"
      );
    st.run(updatesManifestUrl, checkedAt.toISOString());
  };
}
