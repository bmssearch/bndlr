import { JSONStorage, Umzug } from "umzug";

import { Database } from "better-sqlite3";
import migrator000Initial from "./migrators/000_initial";

const createMigrator = (db: Database) =>
  new Umzug({
    migrations: [migrator000Initial],
    context: db,
    storage: new JSONStorage(),
    logger: console,
  });

export const migrate = async (db: Database) => {
  const migrator = createMigrator(db);
  await migrator.up();
};
