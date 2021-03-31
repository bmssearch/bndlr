import { DataTypes, Model, Sequelize } from "sequelize";

export interface DBObservationAttrs {
  specUrl: string;
  checkedAt: Date;
}

interface DBObservationCreationAttrs extends DBObservationAttrs {}

export class DBObservation
  extends Model<DBObservationAttrs, DBObservationCreationAttrs>
  implements DBObservationAttrs {
  static initialize(sequelize: Sequelize) {
    return this.init(
      {
        specUrl: {
          type: DataTypes.STRING(4096),
          allowNull: false,
          primaryKey: true,
        },
        checkedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      { sequelize, timestamps: false, tableName: "observations" }
    );
  }

  public specUrl!: string;
  public checkedAt!: Date;
}
