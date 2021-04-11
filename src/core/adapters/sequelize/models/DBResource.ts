import { DataTypes, Model, Optional, Sequelize } from "sequelize";

import { Bms } from "../../../models/Bms";
import { DBBms } from "./DBBms";
import { Resource } from "../../../models/Resource";

export interface DBResourceAttrs {
  id: number;
  bmsId: number;
  url: string;
  type: "core" | "patch" | "additional";
  updatedAt?: Date;
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
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: false,
        tableName: "resources",
      }
    );
  }

  public toResource = (bms: Bms): Resource => {
    return new Resource({
      id: this.id,
      bms,
      url: this.url,
      type: this.type,
      updatedAt: this.updatedAt,
    });
  };

  public id!: number;
  public bmsId!: number;
  public url!: string;
  public type!: "core" | "patch" | "additional";
  public updatedAt?: Date;

  public bms?: DBBms;
}
