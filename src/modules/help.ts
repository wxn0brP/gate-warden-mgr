import * as user from "./user";

const modules = {
    user
};

export async function func(moduleName?: string) {
    if (moduleName) {
        const module = modules[moduleName as keyof typeof modules];
        if (module && module.help) {
            console.log(module.help);
        } else {
            console.log(`Unknown module: ${moduleName}`);
            console.log("Available modules:", Object.keys(modules).join(", "));
        }
        return;
    }

    console.log("Gate Warden Manager - Help");
    console.log("============================");
    console.log("Usage: gatewarden <module> [args]");
    console.log("Options:");
    console.log("  -d <dir>          Specify the data directory (default: data)");
    console.log("  -D (flag)         Ignore user friendly messages and dump only json output");
    console.log();
    console.log("Available modules:");

    for (const [name, module] of Object.entries(modules)) {
        if (!module.help) continue;
        const help = module.help
            .split("\n")
            .map(line => `    ` + line)
            .join("\n");
        console.log(`  ${name}:\n${help}`);
    }

    console.log();
}