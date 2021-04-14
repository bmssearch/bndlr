import BetterSqlite, { Database } from "better-sqlite3";

import { app } from "electron";
import { migrate } from "./migration";
import path from "path";

export class DatabaseConnector {
  private rawDb?: Database;

  public db = (): Database => {
    if (!this.rawDb) {
      this.initialize();
    }

    return this.rawDb!;
  };

  public initialize = () => {
    this.rawDb = new BetterSqlite(
      path.join(app.getPath("userData"), "bndlr.sqlite"),
      { verbose: console.log }
    );
    this.rawDb.exec("PRAGMA foreign_keys=true");

    migrate(this.rawDb);
  };

  public close = () => {
    this.rawDb?.close();
  };
}
