import { migrate } from "../core/adapters/bettersqlite";

export const initialize = async () => {
  // database migration
  await migrate();
};
