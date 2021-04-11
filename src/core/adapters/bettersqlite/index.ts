import BetterSqlite, { Database } from "better-sqlite3";

import { migrate as rawMigrate } from "./migration";

export class DatabaseConnector {
  private rawDb?: Database;

  public db = (): Database => {
    if (!this.rawDb) {
      this.initialize();
    }

    return this.rawDb!;
  };

  public initialize = () => {
    this.rawDb = new BetterSqlite("./db.sqlite", { verbose: console.log });
    this.rawDb.exec("PRAGMA foreign_keys=true");

    rawMigrate(this.rawDb);
  };
}
