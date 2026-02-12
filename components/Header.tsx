import { Search, Disc, Heart } from 'lucide-react'
import Link from 'next/link'
import LogoutButton from './logout'
import { createClient } from '@/utils/supabase/server'
import MobileNavbar from './MobileNavbar'
import { SideDrawer } from './sideDrawer'

export default async function Header() {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        return <></>
    }
    return (
        <header className="border-b border-white/10 backdrop-blur-xl sticky top-0 z-50">
            <nav className="container mx-auto px-4 h-16 flex items-center justify-start md:justify-between">
                <div className='md:hidden mr-8 flex items-center gap-2'>
                    <SideDrawer />
                    <Disc className="ml-4 w-6 h-6 text-primary" />
                    <span className='font-bold text-xl'>Vinyl Collection</span>
                </div>
            </nav>
            <MobileNavbar />
        </header>
    )
}
