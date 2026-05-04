import { LogOutIcon } from "lucide-react";
import { signOut } from "@/auth";
import posthog from "posthog-js";

interface LogoutEscapeHatchProps {
    class名称?: string;
}

export const LogoutEscapeHatch = ({
    class名称,
}: LogoutEscapeHatchProps) => {
    return (
        <div class名称={class名称}>
            <form
                action={async () => {
                    "use server";
                    await signOut({
                        redirectTo: "/login",
                    }).then(() => {
                        posthog.reset();
                    });
                }}
            >
                <button
                    type="submit"
                    class名称="flex flex-row items-center gap-2 text-sm text-muted-foreground cursor-pointer"
                >
                    <LogOutIcon class名称="w-4 h-4" />
                    退出登录
                </button>
            </form>
        </div>
    );
}