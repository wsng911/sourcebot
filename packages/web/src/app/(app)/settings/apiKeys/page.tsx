import { env } from "@sourcebot/shared";
import { OrgRole } from "@sourcebot/db";
import { ApiKeysPage } from "./apiKeysPage";
import { authenticatedPage } from "@/middleware/authenticatedPage";

export default authenticatedPage(async ({ role }) => {
    let can创建ApiKey = true;
    if (env.DISABLE_API_KEY_CREATION_FOR_NON_OWNER_USERS === 'true') {
        can创建ApiKey = role === OrgRole.OWNER;
    }

    return <ApiKeysPage can创建ApiKey={can创建ApiKey} />;
});
