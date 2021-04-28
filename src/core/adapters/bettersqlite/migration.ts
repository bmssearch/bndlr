import { JSONStorage, Umzug } from "umzug";

import { Database } from "better-sqlite3";
import { app } from "electron";
import log from "electron-log";
import migrator000Initial from "./migrators/000_initial";
import path from "path";

export const migrate = async (db: Database) => {
  const migrator = new Umzug({
    migrations: [migrator000Initial],
    context: db,
    storage: new JSONStorage({
      path: path.join(app.getPath("userData"), "bndlr.migration.json"),
    }),
    logger: log,
  });

  await migrator.up();
};
