import { Search, Disc, Heart } from 'lucide-react'
import Link from 'next/link'
import LogoutButton from './logout'
import { createClient } from '@/utils/supabase/server'
import MobileNavbar from './MobileNavbar'

export default async function Header() {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        return <></>
    }
    return (
        <header className="border-b border-white/10 backdrop-blur-xl sticky top-0 z-50">
            <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/collection" className="flex items-center gap-2 font-bold text-xl md:hidden">
                    <Disc className="w-6 h-6 text-primary" />
                    <span>Vinyl Collection</span>
                </Link>
            </nav>
            <MobileNavbar />
        </header>
    )
}
