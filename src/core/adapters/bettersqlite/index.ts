import Database from "better-sqlite3";
import { migrate as rawMigrate } from "./migration";

export const db = new Database("./db.sqlite", { verbose: console.log });

db.exec("PRAGMA foreign_keys=true");

export const migrate = () => rawMigrate(db);
