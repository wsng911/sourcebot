import { OrganizationAccess设置 } from "@/app/components/organizationAccess设置";
import { authenticatedPage } from "@/middleware/authenticatedPage";
import { OrgRole } from "@sourcebot/db";

export default authenticatedPage(async () => {
    return (
        <div class名称="flex flex-col gap-6">
            <div>
                <h3 class名称="text-lg font-medium">Access Control</h3>
                <p class名称="text-sm text-muted-foreground">Configure how users can access your Sourcebot deployment.{" "}
                    <a
                        href="https://docs.sourcebot.dev/docs/configuration/auth/access-settings"
                        target="_blank"
                        rel="noopener"
                        class名称="underline text-primary hover:text-primary/80 transition-colors"
                    >
                        Learn more
                    </a>
                </p>
            </div>

            <OrganizationAccess设置 />
        </div>
    )
}, {
    minRole: OrgRole.OWNER,
    redirectTo: '/settings',
});
