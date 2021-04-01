import { migrate } from "../../core/adapters/database";

export const initialize = async () => {
  // database migration
  await migrate();
};
