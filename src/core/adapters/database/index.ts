import { DBBms } from "./models/DBBms";
import { DBInstallationHistory } from "./models/DBInstallationHistory";
import { DBInstallationProposal } from "./models/DBInstallationProposal";
import { DBObservation } from "./models/DBObservation";
import { DBResource } from "./models/DBResource";
import { Sequelize } from "sequelize";
import { migrate as rawMigrate } from "./migration";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db.sqlite",
});

DBBms.initialize(sequelize);
DBObservation.initialize(sequelize);
DBResource.initialize(sequelize);
DBInstallationHistory.initialize(sequelize);
DBInstallationProposal.initialize(sequelize);

// associations
DBBms.hasMany(DBResource, { foreignKey: "bmsId" });
DBResource.belongsTo(DBBms, { foreignKey: "bmsId" });

DBResource.hasMany(DBInstallationHistory, { foreignKey: "resourceId" });
DBInstallationHistory.belongsTo(DBResource, {
  foreignKey: "resourceId",
});

DBResource.hasMany(DBInstallationProposal, { foreignKey: "resourceId" });
DBInstallationProposal.belongsTo(DBResource, { foreignKey: "resourceId" });

export const migrate = () => rawMigrate(sequelize);
