import { Database } from "better-sqlite3";
import { RunnableMigration } from "umzug";

type Migrator = RunnableMigration<Database>;

const migrator: Migrator = {
  name: "000_initial",
  up: async ({ context: db }) => {
    db.exec(`
      CREATE TABLE bmses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        domain VARCHAR(4096) NOT NULL,
        domainScopedId VARCHAR NOT NULL,
        title VARCHAR(4096) NOT NULL,
        UNIQUE (domain, domainScopedId)
      )
    `);

    db.exec(`
      CREATE TABLE bms_checks (
        domain VARCHAR(4096) NOT NULL,
        domainScopedId VARCHAR NOT NULL,
        checkedAt TEXT NOT NULL,
        PRIMARY KEY (domain, domainScopedId)
      )
    `);

    db.exec(`
      CREATE TABLE observations (
        manifestUrl VARCHAR(4096) PRIMARY KEY,
        checkedAt TEXT NOT NULL
      )
    `);

    db.exec(`
      CREATE TABLE groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        domain VARCHAR(4096) NOT NULL,
        domainScopedId VARCHAR NOT NULL,
        name VARCHAR(4096) NOT NULL,
        autoAddNewBmses BOOLEAN NOT NULL,
        UNIQUE (domain, domainScopedId)
      )
    `);

    db.exec(`
      CREATE TABLE group_bmses (
        groupId INTEGER NOT NULL,
        bmsId INTEGER NOT NULL,
        UNIQUE (groupId, bmsId),
        FOREIGN KEY (groupId) REFERENCES groups(id),
        FOREIGN KEY (bmsId) REFERENCES bmses(id)
      )
    `);

    db.exec(`
      CREATE TABLE resources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bmsId INTEGER NOT NULL,
        name VARCHAR,
        url VARCHAR(4096) NOT NULL,
        type VARCHAR NOT NULL,
        updatedAt text,
        UNIQUE (bmsId, url),
        FOREIGN KEY (bmsId) REFERENCES bmses(id)
      )
    `);

    db.exec(`
      CREATE TABLE installations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        resourceId INTEGER NOT NULL,
        status VARCHAR NOT NULL,
        checkedAt TEXT,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (resourceId) REFERENCES resources(id)
      )
    `);
  },
  down: async ({ context: db }) => {
    db.exec("DROP TABLE bmses");
    db.exec("DROP TABLE bms_checks");
    db.exec("DROP TABLE observations");
    db.exec("DROP TABLE groups");
    db.exec("DROP TABLE group_bmses");
    db.exec("DROP TABLE resources");
    db.exec("DROP TABLE installations");
  },
};

export default migrator;
