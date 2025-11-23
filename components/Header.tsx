'use client'

import { createClient } from '@/utils/supabase/client'
import { LogOut, Search, Disc } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Header() {
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    return (
        <header className="border-b border-white/10 backdrop-blur-xl sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
                    <Disc className="w-6 h-6 text-primary" />
                    <span>Vinyl Collection</span>
                </Link>

                <div className="flex items-center gap-4">
                    <Link
                        href="/search"
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                    >
                        <Search className="w-4 h-4" />
                        Search Records
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="p-2 rounded-full"
                        title="Sign out"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    )
}
