import { SequelizeStorage, Umzug } from "umzug";

import { Sequelize } from "sequelize";
import { migrator as migrator000Initial } from "./migrators/000_initial";

const createMigrator = (sequelize: Sequelize) =>
  new Umzug({
    migrations: [migrator000Initial],
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });

export const migrate = async (sequelize: Sequelize) => {
  const migrator = createMigrator(sequelize);
  await migrator.up();
};
