'use client';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { verifyCredentialsRequestSchema } from "@/lib/schemas";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import useCaptureEvent from "@/hooks/useCaptureEvent";

interface CredentialsFormProps {
    callbackUrl?: string;
    context: "login" | "signup";
}

export const CredentialsForm = ({ callbackUrl, context }: CredentialsFormProps) => {
    const captureEvent = useCaptureEvent();
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof verifyCredentialsRequestSchema>>({
        resolver: zodResolver(verifyCredentialsRequestSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const on提交 = (values: z.infer<typeof verifyCredentialsRequestSchema>) => {
        setIsLoading(true);
        captureEvent("wa_login_with_credentials", {});
        signIn("credentials", {
            email: values.email,
            password: values.password,
            redirectTo: callbackUrl ?? "/"
        })
        .catch(() => {
            setIsLoading(false);
        });
        // signIn will redirect on success, so don't set isLoading to false
    }

    return (
        <Form {...form}>
            <form
                on提交={form.handle提交(on提交)}
                class名称="w-full"
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem class名称="mb-4">
                            <FormLabel>邮箱</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="email@example.com"
                                    autoComplete="email"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem class名称="mb-8">
                            <FormLabel>密码</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    autoComplete={context === "signup" ? "new-password" : "current-password"}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    class名称="w-full"
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 class名称="animate-spin mr-2" /> : ""}
                    {context === "login" ? "登录 with credentials" : "注册 with credentials"}
                </Button>
            </form>
        </Form>
    );
} 