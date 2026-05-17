import { parseArgs } from "util";
const { values, positionals } = parseArgs({
    args: Bun.argv,
    options: {
        dir: {
            type: "string",
            default: "data",
            short: "d",
        },
        dump: {
            type: "boolean",
            default: false,
            short: "D",
        }
    },
    allowPositionals: true,
});
export const config = {
    dir: values.dir,
    dump: values.dump
};
positionals.shift(); // remove "node/bun"
positionals.shift(); // remove "index.ts"
export const args = positionals;
