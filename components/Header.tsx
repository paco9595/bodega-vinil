import { Search, Disc, Heart } from 'lucide-react'
import Link from 'next/link'
import LogoutButton from './logout'
import { createClient } from '@/utils/supabase/server'

export default async function Header() {
    const supabase = await createClient()

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        return <></>
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
                        href="/wishlist"
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                    >
                        <Heart className="w-4 h-4" />
                        Wishlist
                    </Link>
                    <Link
                        href="/search"
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                    >
                        <Search className="w-4 h-4" />
                        Search Records
                    </Link>
                    <LogoutButton />
                </div>
            </div>
        </header>
    )
}
