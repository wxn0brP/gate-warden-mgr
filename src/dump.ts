import { config } from "./config";

export function cdump(data: any) {
    if (!config.dump) return;
    const json = JSON.stringify(data);
    console.log(`[JSON]${json}[/JSON]`);
}

export function clog(...data: any[]) {
    if (config.dump) return;
    console.log(...data);
}