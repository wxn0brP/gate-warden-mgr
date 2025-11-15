import * as user from "./user.js";
import * as role from "./role.js";
import * as acl from "./acl.js";
import * as rbac from "./rbac.js";
import * as abac from "./abac.js";
const modules = {
    user,
    role,
    acl,
    rbac,
    abac,
};
export async function func(moduleName) {
    if (moduleName) {
        const module = modules[moduleName];
        if (module && module.help) {
            console.log(module.help);
        }
        else {
            console.log(`Unknown module: ${moduleName}`);
            console.log("Available modules:", Object.keys(modules).join(", "));
        }
        return;
    }
    console.log("Gate Warden Manager - Help");
    console.log("============================");
    console.log("Usage: gatewarden <module> [args]");
    console.log("Options:");
    console.log(" -d <dir>          Specify the data directory (default: data)");
    console.log(" -D (flag)         Ignore user friendly messages and dump only json output");
    console.log();
    console.log("Available modules:");
    for (const [name, module] of Object.entries(modules)) {
        if (!module.help)
            continue;
        const helpArray = module.help.split("\n");
        const description = helpArray.shift() || "";
        const help = helpArray.map(line => `   ` + line).join("\n");
        console.log(` ${name}: ${description}\n${help}\n`);
    }
}
