import { DataTypes, Model, Optional, Sequelize } from "sequelize";

import { DBResource } from "./DBResource";
import { Installation } from "../../../models/Installation";
import { Resource } from "../../../models/Resource";

type DBInstallationStatus = "proposed" | "installed" | "failed" | "skipped";

export interface DBInstallationAttrs {
  id: number;
  resourceId: number;
  status: DBInstallationStatus;
  checkedAt?: Date;
  createdAt: Date;
}

interface DBInstallationCreationAttrs
  extends Optional<DBInstallationAttrs, "id"> {}

export class DBInstallation
  extends Model<DBInstallationAttrs, DBInstallationCreationAttrs>
  implements DBInstallationAttrs {
  static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        resourceId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM,
          values: ["proposed", "installed", "failed", "skipped"],
          allowNull: false,
        },
        checkedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        tableName: "installations",
      }
    );
  }

  public toInstallation = (resource: Resource): Installation => {
    return new Installation({
      id: this.id,
      resource,
      status: this.status,
      checkedAt: this.checkedAt,
      createdAt: this.createdAt,
    });
  };

  public id!: number;
  public resourceId!: number;
  public status!: DBInstallationStatus;
  public checkedAt?: Date;
  public createdAt!: Date;

  public resource?: DBResource;
}
