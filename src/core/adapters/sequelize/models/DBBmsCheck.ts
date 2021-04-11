import { DataTypes, Model, Sequelize } from "sequelize";

import { BmsCheck } from "../../../models/BmsCheck";

export interface DBBmsCheckAttrs {
  domain: string;
  domainScopedId: string;
  checkedAt: Date;
}

interface DBBmsCheckCreationAttrs extends DBBmsCheckAttrs {}

export class DBBmsCheck
  extends Model<DBBmsCheckAttrs, DBBmsCheckCreationAttrs>
  implements DBBmsCheckAttrs {
  static initialize(sequelize: Sequelize) {
    this.init(
      {
        domain: {
          type: DataTypes.STRING(4096),
          allowNull: false,
          primaryKey: true,
        },
        domainScopedId: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true,
        },
        checkedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      { sequelize, timestamps: false, tableName: "bms_checks" }
    );
  }

  public toBmsCheck = (): BmsCheck => {
    return new BmsCheck({
      domain: this.domain,
      domainScopedId: this.domainScopedId,
      checkedAt: this.checkedAt,
    });
  };

  public domain!: string;
  public domainScopedId!: string;
  public checkedAt!: Date;
}
