import { ValtheraCreate } from "@wxn0brp/db";
import { UserManager, WardenManager } from "@wxn0brp/gate-warden";
import { config } from "./config.js";
export const db = ValtheraCreate(config.dir);
export const wardenMgr = new WardenManager(db);
export const userMgr = new UserManager(db);
