import { DBBms } from "./models/DBBms";
import { DBObservation } from "./models/DBObservation";
import { DBResource } from "./models/DBResource";
import { DBResourceHistory } from "./models/DBResourceHistory";
import { DBResourceQueue } from "./models/DBResourceQueue";
import { Sequelize } from "sequelize";
import { migrate } from "./migration";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db.sqlite",
});

DBBms.initialize(sequelize);
DBObservation.initialize(sequelize);
DBResource.initialize(sequelize);
DBResourceHistory.initialize(sequelize);
DBResourceQueue.initialize(sequelize);

// associations
DBBms.hasMany(DBResource, { foreignKey: "bmsId" });
DBResource.belongsTo(DBBms, { foreignKey: "bmsId" });

DBResource.hasMany(DBResourceHistory, { foreignKey: "resourceId" });
DBResourceHistory.belongsTo(DBResource, {
  foreignKey: "resourceId",
});

DBResource.hasMany(DBResourceQueue, { foreignKey: "resourceId" });
DBResourceQueue.belongsTo(DBResource, { foreignKey: "resourceId" });

migrate(sequelize);
