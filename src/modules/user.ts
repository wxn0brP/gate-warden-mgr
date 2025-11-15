import { userMgr } from "../db";
import { clog, cdump } from "../dump";

export const help = `
Manage users
Actions:
    get <userId> - Get user by ID
    create <userId> <userData> - Create a new user - { roles?: Id[]; attrib?: A }
    role:
        add <roleId> - Add a role to user
        rm <roleId> - Remove a role from user
`.trim();

export async function func(action: string, userId: string, userIdIfRoleAction?: string) {
    if (!userId) {
        console.error("Usage: gatewarden user <action> <userId>");
        console.error(help);
        process.exit(1);
    }

    if (action === "role") {
        action = "role " + userId;
        userId = userIdIfRoleAction;
    }

    try {
        switch (action) {
            case "get":
                const user = await userMgr.getUser(userId);
                if (user) {
                    clog("User found:", user);
                    cdump(user);
                } else {
                    clog("User not found");
                    cdump(null);
                }
                break;

            case "create":
                let userData: any;
                try {
                    userData = JSON.parse(userIdIfRoleAction || "{}");
                    userData._id = userId; // Ensure the ID matches the parameter
                } catch (error) {
                    console.error("Invalid JSON for user data");
                    process.exit(1);
                }

                const createdUser = await userMgr.createUser(userData);
                clog("User created:", createdUser);
                cdump(createdUser);
                break;

            case "role add":
                if (!userIdIfRoleAction) {
                    console.error("For role add action, provide roleId");
                    process.exit(1);
                }
                await userMgr.addRoleToUser(userId, userIdIfRoleAction);
                clog(`Role ${userIdIfRoleAction} added to user ${userId}`);
                cdump(true);
                break;

            case "role rm":
                if (!userIdIfRoleAction) {
                    console.error("For role rm action, provide roleId");
                    process.exit(1);
                }
                await userMgr.removeRoleFromUser(userId, userIdIfRoleAction);
                clog(`Role ${userIdIfRoleAction} removed from user ${userId}`);
                cdump(true);
                break;

            default:
                console.error(`Unknown action: ${action}`);
                console.error(help);
                process.exit(1);
        }
    } catch (error) {
        console.error("Error performing user operation:", error);
        process.exit(1);
    }
}