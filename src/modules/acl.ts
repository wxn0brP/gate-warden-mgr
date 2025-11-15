import { wardenMgr } from "../db";
import { clog, cdump } from "../dump";

export const help = `
Manage ACL rules
add <entityId> <permission> [userId] - Add an ACL rule for an entity (with optional user ID)
rm <entityId> [userId] - Remove an ACL rule for an entity (with optional user ID)
`.trim();

export async function func(action: string, entityId: string, permission?: string, userId?: string) {
    if (!action || !entityId) {
        console.error("Usage: gatewarden acl <action> <entityId> [permission] [userId]");
        console.error(help);
        process.exit(1);
    }

    try {
        switch (action) {
            case "add":
                if (!permission) {
                    console.error("For ACL add action, provide permission number");
                    process.exit(1);
                }

                // Parse permission as number
                const permValue = parseInt(permission, 10);
                if (isNaN(permValue)) {
                    console.error("Permission must be a number");
                    process.exit(1);
                }

                const aclRule = await wardenMgr.addACLRule(entityId, permValue, userId);
                clog("ACL rule created:", aclRule);
                cdump(aclRule);
                break;

            case "rm":
                const removed = await wardenMgr.removeACLRule(entityId, userId);
                if (removed) {
                    clog(`ACL rule for entity ${entityId} ${userId ? `and user ${userId}` : ""} removed`);
                    cdump(true);
                } else {
                    clog(`ACL rule for entity ${entityId} ${userId ? `and user ${userId}` : ""} not found or could not be removed`);
                    cdump(false);
                }
                break;

            default:
                console.error(`Unknown action: ${action}`);
                console.error(help);
                process.exit(1);
        }
    } catch (error) {
        console.error("Error performing ACL operation:", error);
        process.exit(1);
    }
}