import { config } from "./config.js";
export function cdump(data) {
    if (!config.dump)
        return;
    const json = JSON.stringify(data);
    console.log(`[JSON]${json}[/JSON]`);
}
export function clog(...data) {
    if (config.dump)
        return;
    console.log(...data);
}
