import { DataTypes, Model, Optional, Sequelize } from "sequelize";

import { Group } from "../../../../core/models/Group";

export interface DBGroupAttrs {
  id: number;
  domain: string;
  domainScopedId: string;
  name: string;
  autoAddNewBmses: boolean;
}

interface DBGroupCreationAttrs extends Optional<DBGroupAttrs, "id"> {}

export class DBGroup
  extends Model<DBGroupAttrs, DBGroupCreationAttrs>
  implements DBGroupAttrs {
  static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
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
        name: {
          type: DataTypes.STRING(4096),
          allowNull: false,
        },
        autoAddNewBmses: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
      },
      { sequelize, timestamps: false, tableName: "groups" }
    );
  }

  public toGroup = (): Group => {
    return new Group({
      id: this.id,
      domain: this.domain,
      domainScopedId: this.domainScopedId,
      name: this.name,
      autoDownloadNewBmses: this.autoAddNewBmses,
    });
  };

  public id!: number;
  public domain!: string;
  public domainScopedId!: string;
  public name!: string;
  public autoAddNewBmses!: boolean;
}
