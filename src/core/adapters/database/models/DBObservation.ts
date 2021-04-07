import { DataTypes, Model, Sequelize } from "sequelize";

import { Observation } from "../../../../core/models/Observation";

export interface DBObservationAttrs {
  manifestUrl: string;
  checkedAt: Date;
}

interface DBObservationCreationAttrs extends DBObservationAttrs {}

export class DBObservation
  extends Model<DBObservationAttrs, DBObservationCreationAttrs>
  implements DBObservationAttrs {
  static initialize(sequelize: Sequelize) {
    return this.init(
      {
        manifestUrl: {
          type: DataTypes.STRING(4096),
          allowNull: false,
          primaryKey: true,
        },
        checkedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        tableName: "observations",
      }
    );
  }

  public toObservation = () => {
    return new Observation({
      manifestUrl: this.manifestUrl,
      checkedAt: this.checkedAt,
    });
  };

  public manifestUrl!: string;
  public checkedAt!: Date;
}
