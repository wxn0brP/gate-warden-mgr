#!/usr/bin/env bun
import { args } from "./config.js";
const name = args.shift();
if (!name || name === "help") {
    const { func: helpFunc } = await import("./modules/help.js");
    await helpFunc(...(name === "help" ? args : []));
    process.exit(0);
}
const { func } = await import(`./modules/${name}.js`);
func(...args);
