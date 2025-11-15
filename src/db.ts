import { Valthera } from "@wxn0brp/db";
import { UserManager, WardenManager } from "@wxn0brp/gate-warden";
import { config } from "./config";

export const db = new Valthera(config.dir);
export const wardenMgr = new WardenManager(db);
export const userMgr = new UserManager(db);