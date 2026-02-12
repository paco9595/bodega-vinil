import { Disc, Heart, Search, User } from "lucide-react";
import Link from "next/link";
import AvatarUser from "./avatarUser";
import useServerUser from "@/hooks/useServerUser";

export default async function Sidebar() {
    const { user } = await useServerUser()
    return (
        <div className="w-64 border-r px-4 py-6 hidden md:flex border-white/10 backdrop-blur-xl sticky top-0 h-screen flex-col">
            <Link href="/collection" className="flex items-center gap-2 font-bold text-xl">
                <Disc className="w-6 h-6 text-primary" />
                <span>Vinyl Collection</span>
            </Link>
            <nav className="flex flex-col gap-2 mt-6 flex-1">
                <Link href="/profile" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                </Link>
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
                <AvatarUser user={user} />
            </div>
        </div>
    )
}