import { wardenMgr } from "../db";
import { clog, cdump } from "../dump";

export const help = `
Manage ABAC rules
add <entityId> <flag> <condition> - Add an ABAC rule with a condition object
rm <entityId> <flag> - Remove an ABAC rule
`.trim();

export async function func(action: string, entityId: string, flag?: string, conditionStr?: string) {
    if (!action || !entityId) {
        console.error("Usage: gatewarden abac <action> <entityId> [flag] [condition]");
        console.error(help);
        process.exit(1);
    }

    try {
        switch (action) {
            case "add":
                if (!flag || !conditionStr) {
                    console.error("For ABAC add action, provide flag number and condition JSON");
                    process.exit(1);
                }

                // Parse flag as number
                const flagValue = parseInt(flag, 10);
                if (isNaN(flagValue)) {
                    console.error("Flag must be a number");
                    process.exit(1);
                }

                let condition: any;
                try {
                    condition = JSON.parse(conditionStr);
                } catch (error) {
                    console.error("Invalid JSON for condition");
                    process.exit(1);
                }

                const abacRule = await wardenMgr.addABACRule(entityId, flagValue, condition);
                clog("ABAC rule created:", abacRule);
                cdump(abacRule);
                break;

            case "rm":
                if (!flag) {
                    console.error("For ABAC rm action, provide flag number");
                    process.exit(1);
                }

                // Parse flag as number
                const flagValueRm = parseInt(flag, 10);
                if (isNaN(flagValueRm)) {
                    console.error("Flag must be a number");
                    process.exit(1);
                }

                const removed = await wardenMgr.removeABACRule(entityId, flagValueRm);
                if (removed) {
                    clog(`ABAC rule for entity ${entityId} and flag ${flagValueRm} removed`);
                    cdump(true);
                } else {
                    clog(`ABAC rule for entity ${entityId} and flag ${flagValueRm} not found or could not be removed`);
                    cdump(false);
                }
                break;

            default:
                console.error(`Unknown action: ${action}`);
                console.error(help);
                process.exit(1);
        }
    } catch (error) {
        console.error("Error performing ABAC operation:", error);
        process.exit(1);
    }
}