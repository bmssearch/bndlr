import { DataTypes } from "sequelize";
import { Migrator } from "./types";

export const migrator: Migrator = {
  name: "000_initial",
  up: async ({ context: qi }) => {
    await qi.createTable(
      "bmses",
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
        },
        domainScopedId: {
          type: DataTypes.STRING,
          allowNull: false,
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
      { uniqueKeys: { idWithDomain: { fields: ["domain", "domainScopedId"] } } }
    );

    await qi.createTable("observations", {
      specUrl: {
        type: DataTypes.STRING(4096),
        allowNull: false,
        primaryKey: true,
      },
      checkedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });

    await qi.createTable(
      "resources",
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
          references: { model: "bmses", key: "id" },
        },
        url: {
          type: DataTypes.STRING(4096),
          allowNull: false,
        },
        type: {
          type: DataTypes.ENUM,
          values: ["core", "patch", "additional"],
          allowNull: false,
        },
      },
      { uniqueKeys: { urlWithBmsId: { fields: ["bmsId", "url"] } } }
    );

    await qi.createTable("installation_proposals", {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      resourceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "resources", key: "id" },
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    });

    await qi.createTable("installation_histories", {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      resourceId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "resources", key: "id" },
      },
      result: {
        type: DataTypes.ENUM,
        values: ["installed", "failed", "skipped"],
        allowNull: false,
      },
      checkedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  },
  down: async ({ context: qi }) => {
    await qi.dropTable("bmses");
    await qi.dropTable("observations");
    await qi.dropTable("resources");
    await qi.dropTable("installation_proposals");
    await qi.dropTable("installation_histories");
  },
};
