import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface DBResourceHistoryAttrs {
  id: number;
  resourceId: number;
  result: "installed" | "failed" | "skipped";
  checkedAt: Date;
}

interface DBResourceHistoryCreationAttrs
  extends Optional<DBResourceHistoryAttrs, "id"> {}

export class DBResourceHistory
  extends Model<DBResourceHistoryAttrs, DBResourceHistoryCreationAttrs>
  implements DBResourceHistoryAttrs {
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
      { sequelize, timestamps: false, tableName: "checked_resources" }
    );
  }

  public id!: number;
  public resourceId!: number;
  public result!: "installed" | "failed" | "skipped";
  public checkedAt!: Date;
}
