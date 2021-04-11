import { QueryInterface } from "sequelize";
import { RunnableMigration } from "umzug";

export type Migrator = RunnableMigration<QueryInterface>;
