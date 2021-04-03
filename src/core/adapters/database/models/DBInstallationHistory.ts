import { DataTypes, Model, Optional, Sequelize } from "sequelize";

import { InstallationHistory } from "../../../models/InstallationHistory";

export interface DBInstallationHistoryAttrs {
  id: number;
  resourceId: number;
  result: "installed" | "failed" | "skipped";
  checkedAt: Date;
}

interface DBInstallationHistoryCreationAttrs
  extends Optional<DBInstallationHistoryAttrs, "id"> {}

export class DBInstallationHistory
  extends Model<DBInstallationHistoryAttrs, DBInstallationHistoryCreationAttrs>
  implements DBInstallationHistoryAttrs {
  static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        resourceId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        result: {
          type: DataTypes.ENUM,
          values: ["installed", "failed", "skipped"],
          allowNull: false,
        },
        checkedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      { sequelize, timestamps: false, tableName: "installation_histories" }
    );
  }

  public toInstallationHistory = (): InstallationHistory => {
    return new InstallationHistory({
      id: this.id,
      resourceId: this.resourceId,
      result: this.result,
      checkedAt: this.checkedAt,
    });
  };

  public id!: number;
  public resourceId!: number;
  public result!: "installed" | "failed" | "skipped";
  public checkedAt!: Date;
}
