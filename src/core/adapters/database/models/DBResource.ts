import { DataTypes, Model, Optional, Sequelize } from "sequelize";

import { Resource } from "../../../models/Resource";

export interface DBResourceAttrs {
  id: number;
  bmsId: number;
  url: string;
  type: "core" | "patch" | "additional";
}

interface DBResourceCreationAttrs extends Optional<DBResourceAttrs, "id"> {}

export class DBResource
  extends Model<DBResourceAttrs, DBResourceCreationAttrs>
  implements DBResourceAttrs {
  static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        bmsId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: "urlWithBmsId",
        },
        url: {
          type: DataTypes.STRING(4096),
          allowNull: false,
          unique: "urlWithBmsId",
        },
        type: {
          type: DataTypes.ENUM,
          values: ["core", "patch", "additional"],
          allowNull: false,
        },
      },
      { sequelize, timestamps: false, tableName: "resources" }
    );
  }

  public toResource = (): Resource => {
    return new Resource({
      id: this.id,
      bmsId: this.bmsId,
      url: this.url,
      type: this.type,
    });
  };

  public id!: number;
  public bmsId!: number;
  public url!: string;
  public type!: "core" | "patch" | "additional";
}
