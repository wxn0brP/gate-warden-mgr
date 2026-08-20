#!/usr/bin/env bun
import { args, printVersion } from "./config.js";
import { readFileSync } from "fs";
import { join } from "path";
const name = args.shift();
if (name === "v" || printVersion) {
    const pkg = JSON.parse(readFileSync(join(import.meta.dir, "..", "package.json"), "utf-8"));
    console.log(pkg.version);
    process.exit(0);
}
if (!name || name === "help") {
    const { func: helpFunc } = await import("./modules/help.js");
    await helpFunc(...(name === "help" ? args : []));
    process.exit(0);
}
const { func } = await import(`./modules/${name}.js`);
func(...args);
