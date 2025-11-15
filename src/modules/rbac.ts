import { wardenMgr } from "../db";
import { clog, cdump } from "../dump";

export const help = `
Manage RBAC rules
add <roleId> <entityId> <permission> - Add an RBAC rule connecting a role to an entity with permission
rm <roleId> <entityId> - Remove an RBAC rule connecting a role to an entity
`.trim();

export async function func(action: string, roleId: string, entityId?: string, permission?: string) {
    if (!action || !roleId) {
        console.error("Usage: gatewarden rbac <action> <roleId> [entityId] [permission]");
        console.error(help);
        process.exit(1);
    }

    try {
        switch (action) {
            case "add":
                if (!entityId || !permission) {
                    console.error("For RBAC add action, provide entity ID and permission number");
                    process.exit(1);
                }

                const permValue = parseNumber(permission);
                if (isNaN(permValue)) {
                    console.error("Permission must be a number");
                    process.exit(1);
                }

                const rbacRule = await wardenMgr.addRBACRule(roleId, entityId, permValue);
                clog("RBAC rule created:", rbacRule);
                cdump(rbacRule);
                break;

            case "rm":
                if (!entityId) {
                    console.error("For RBAC rm action, provide entity ID");
                    process.exit(1);
                }

                const removed = await wardenMgr.removeRBACRule(roleId, entityId);
                if (removed) {
                    clog(`RBAC rule for role ${roleId} and entity ${entityId} removed`);
                    cdump(true);
                } else {
                    clog(`RBAC rule for role ${roleId} and entity ${entityId} not found or could not be removed`);
                    cdump(false);
                }
                break;

            default:
                console.error(`Unknown action: ${action}`);
                console.error(help);
                process.exit(1);
        }
    } catch (error) {
        console.error("Error performing RBAC operation:", error);
        process.exit(1);
    }
}

function parseNumber(str: string) {
    str = str.trim();
    if (str.startsWith("0x") || str.startsWith("0X")) {
        return parseInt(str, 16);
    }
    if (str.startsWith("0b") || str.startsWith("0B")) {
        return parseInt(str, 2);
    }
    return parseInt(str, 10);
}