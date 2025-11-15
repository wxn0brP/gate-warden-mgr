import { wardenMgr } from "../db.js";
import { clog, cdump } from "../dump.js";
export const help = `
Manage roles
add <roleName> <roleData> - Add a new role - { name: string }
rm <roleId> - Remove a role by ID
name-to-id <roleName> - Change role name to ID, alias: n2i
`.trim();
export async function func(action, roleNameOrId, roleDataStr) {
    if (!action || !roleNameOrId) {
        console.error("Usage: gatewarden role <action> <roleNameOrId> [roleData]");
        console.error(help);
        process.exit(1);
    }
    try {
        switch (action) {
            case "add":
                let roleData;
                try {
                    roleData = JSON.parse(roleDataStr || "{}");
                    roleData.name = roleNameOrId; // Ensure the name matches the parameter
                }
                catch (error) {
                    console.error("Invalid JSON for role data");
                    process.exit(1);
                }
                const createdRole = await wardenMgr.addRole(roleData);
                clog("Role created:", createdRole);
                cdump(createdRole);
                break;
            case "rm":
                const removed = await wardenMgr.removeRole(roleNameOrId);
                if (removed) {
                    clog(`Role ${roleNameOrId} removed`);
                    cdump(true);
                }
                else {
                    clog(`Role ${roleNameOrId} not found or could not be removed`);
                    cdump(false);
                }
                break;
            case "name-to-id":
            case "n2i":
                const roleId = await wardenMgr.changeRoleNameToId(roleNameOrId);
                if (roleId) {
                    clog(`Role ID for ${roleNameOrId}:`, roleId);
                    cdump(roleId);
                }
                else {
                    clog(`Role ${roleNameOrId} not found`);
                    cdump(null);
                }
                break;
            default:
                console.error(`Unknown action: ${action}`);
                console.error(help);
                process.exit(1);
        }
    }
    catch (error) {
        console.error("Error performing role operation:", error);
        process.exit(1);
    }
}
