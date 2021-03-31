import { DataTypes, Model, Sequelize } from "sequelize";

export interface DBResourceQueueAttrs {
  id: number;
  resourceId: number;
  updatedAt: Date;
}

interface DBResourceQueueCreationAttrs extends DBResourceQueueAttrs {}

export class DBResourceQueue
  extends Model<DBResourceQueueAttrs, DBResourceQueueCreationAttrs>
  implements DBResourceQueueAttrs {
  static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        resourceId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      { sequelize, timestamps: false, tableName: "resource_queues" }
    );
  }

  public id!: number;
  public resourceId!: number;
  public updatedAt!: Date;
}
