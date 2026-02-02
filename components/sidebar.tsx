import { Disc, Heart, Search } from "lucide-react";
import Link from "next/link";
import LogoutButton from "./logout";

export default function Sidebar() {
    return (
        <div className="w-64 border-r px-4 py-6 hidden md:flex border-white/10 backdrop-blur-xl sticky top-0 h-screen flex-col">
            <Link href="/collection" className="flex items-center gap-2 font-bold text-xl">
                <Disc className="w-6 h-6 text-primary" />
                <span>Vinyl Collection</span>
            </Link>
            <nav className="flex flex-col gap-2 mt-6 flex-1">
                <Link href="/collection" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium">
                    <Disc className="w-4 h-4" />
                    <span>Collection</span>
                </Link>
                <Link href="/wishlist" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium">
                    <Heart className="w-4 h-4" />
                    <span>Wishlist</span>
                </Link>
                <Link href="/search" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium">
                    <Search className="w-4 h-4" />
                    <span>Search Records</span>
                </Link>
            </nav>
            <div >
                <LogoutButton />
            </div>
        </div>
    )
}