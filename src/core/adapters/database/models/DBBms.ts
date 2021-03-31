import { DataTypes, Model, Optional, Sequelize } from "sequelize";

import { Bms } from "../../../models/Bms";

export interface DBBmsAttrs {
  id: number;
  domain: string;
  domainScopedId: string;
  specUrl: string;
  checkedAt: Date;
}

interface DBBmsCreationAttrs extends Optional<DBBmsAttrs, "id"> {}

export class DBBms
  extends Model<DBBmsAttrs, DBBmsCreationAttrs>
  implements DBBmsAttrs {
  static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        domain: {
          type: DataTypes.STRING(4096),
          allowNull: false,
          unique: "idWithDomain",
        },
        domainScopedId: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: "idWithDomain",
        },
        specUrl: {
          type: DataTypes.STRING(4096),
          allowNull: false,
        },
        checkedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      { sequelize, timestamps: false, tableName: "bmses" }
    );
  }

  public toBms = (): Bms => {
    return new Bms({
      id: this.id,
      domain: this.domain,
      domainScopedId: this.domainScopedId,
      specUrl: this.specUrl,
      checkedAt: this.checkedAt,
    });
  };

  public id!: number;
  public domain!: string;
  public domainScopedId!: string;
  public specUrl!: string;
  public checkedAt!: Date;
}
