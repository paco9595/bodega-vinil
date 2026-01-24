'use client'
import Link from "next/link";
import { Heart, Search, Disc } from "lucide-react";
import LogoutButton from "./logout";
import Portal from "./Portal";

export default function MobileNavbar() {

    return (
        <Portal>
            <nav className="sticky  bottom-0 left-0 right-0 bg-(--bg) border-t py-4 grid grid-cols-3 md:hidden text-(--text)">
                <Link href="/wishlist" className="flex items-center gap-2 justify-center">
                    <Heart className="w-5 h-5" />
                </Link>
                <Link href="/search" className="flex items-center gap-2 justify-center">
                    <Search className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-2 justify-center">
                    <LogoutButton />
                </div>
            </nav>
        </Portal>
    )
}