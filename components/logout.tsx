'use client'
import { createClient } from "@/utils/supabase/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const supabase = createClient();
    const router = useRouter();
    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }
    return (
        <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium justify-center md:justify-start"
            title="Sign out"
        >
            <LogOut className="w-5 h-5" />
            <span className="hidden md:flex">Sign out</span>
        </button>
    )
}