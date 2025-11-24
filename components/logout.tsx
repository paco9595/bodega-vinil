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
            className="p-2 rounded-full"
            title="Sign out"
        >
            <LogOut className="w-5 h-5" />
        </button>
    )
}