import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
    return (
        <footer class名称="w-full mt-auto py-4 flex flex-row justify-center items-center gap-4">
        <Link href="https://sourcebot.dev" class名称="text-gray-400 text-sm hover:underline">About</Link>
        <Separator orientation="vertical" class名称="h-4" />
        <Link href="https://docs.sourcebot.dev" class名称="text-gray-400 text-sm hover:underline">Docs</Link>
        <Separator orientation="vertical" class名称="h-4" />
        <Link href="https://sourcebot.dev/security" class名称="text-gray-400 text-sm hover:underline">Security</Link>
        <Separator orientation="vertical" class名称="h-4" />
        <Link href="https://www.sourcebot.dev/contact" target="_blank" class名称="text-gray-400 text-sm hover:underline">Contact Us</Link>
    </footer>
    )
}