import { DataTypes } from "sequelize";
import { Migrator } from "./types";

export const migrator: Migrator = {
  name: "000_initial",
  up: async ({ context: qi }) => {
    await qi.createTable(
      "bmses",
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
        },
        domainScopedId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING(4096),
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
      "groups",
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
        manifestUrl: {
          type: DataTypes.STRING(4096),
          allowNull: false,
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
      { uniqueKeys: { idWithDomain: { fields: ["domain", "domainScopedId"] } } }
    );

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
      { uniqueKeys: { urlWithBmsId: { fields: ["bmsId", "url"] } } }
    );

    await qi.createTable("installations", {
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
    });
  },
  down: async ({ context: qi }) => {
    await qi.dropTable("bmses");
    await qi.dropTable("observations");
    await qi.dropTable("groups");
    await qi.dropTable("resources");
    await qi.dropTable("installations");
  },
};
