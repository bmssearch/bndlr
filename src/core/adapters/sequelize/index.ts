import { DBBms } from "./models/DBBms";
import { DBBmsCheck } from "./models/DBBmsCheck";
import { DBGroup } from "./models/DBGroup";
import { DBInstallation } from "./models/DBInstallation";
import { DBObservation } from "./models/DBObservation";
import { DBResource } from "./models/DBResource";
import { Sequelize } from "sequelize";
import { migrate as rawMigrate } from "./migration";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db.sqlite",
});

DBBms.initialize(sequelize);
DBBmsCheck.initialize(sequelize);
DBObservation.initialize(sequelize);
DBGroup.initialize(sequelize);
DBResource.initialize(sequelize);
DBInstallation.initialize(sequelize);

// associations
DBBms.hasMany(DBResource, {
  foreignKey: "bmsId",
});
DBResource.belongsTo(DBBms, {
  foreignKey: "bmsId",
  as: "bms",
});

DBResource.hasMany(DBInstallation, { foreignKey: "resourceId" });
DBInstallation.belongsTo(DBResource, {
  foreignKey: "resourceId",
  as: "resource",
});

export const migrate = () => rawMigrate(sequelize);
