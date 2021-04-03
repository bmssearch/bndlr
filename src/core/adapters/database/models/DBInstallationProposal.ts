import { DataTypes, Model, Optional, Sequelize } from "sequelize";

import { InstallationProposal } from "../../../models/InstallationProposal";

export interface DBInstallationProposalAttrs {
  id: number;
  resourceId: number;
  updatedAt: Date | null;
}

interface DBInstallationProposalCreationAttrs
  extends Optional<DBInstallationProposalAttrs, "id"> {}

export class DBInstallationProposal
  extends Model<
    DBInstallationProposalAttrs,
    DBInstallationProposalCreationAttrs
  >
  implements DBInstallationProposalAttrs {
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
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      { sequelize, timestamps: false, tableName: "installation_proposals" }
    );
  }

  public toInstallationProposal = (): InstallationProposal => {
    return new InstallationProposal({
      id: this.id,
      resourceId: this.resourceId,
      updatedAt: this.updatedAt || undefined,
    });
  };

  public id!: number;
  public resourceId!: number;
  public updatedAt!: Date | null;
}
