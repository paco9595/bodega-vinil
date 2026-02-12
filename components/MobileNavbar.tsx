'use client'
import Link from "next/link";
import { Heart, Search, Home, Library } from "lucide-react";
import Portal from "./Portal";
import { usePathname } from "next/navigation";

export default function MobileNavbar() {
    //compara la ruta para saber el tab activo
    const activeTab = usePathname()

    return (
        <Portal>
            <nav className="sticky bottom-0 left-0 right-0 bg-(--bg) border-t py-4 grid grid-cols-4 md:hidden text-(--text)">
                <TabButton
                    icon={Home}
                    label="Discover"
                    active={activeTab === '/discover'}
                    href="/discover"
                />
                <TabButton
                    icon={Search}
                    label="Search"
                    active={activeTab === '/search'}
                    href="/search"
                />
                <TabButton
                    icon={Library}
                    label="Collection"
                    active={activeTab === '/collection'}
                    href="/collection"
                />
                <TabButton
                    icon={Heart}
                    label="Wishlist"
                    active={activeTab === '/wishlist'}
                    href="/wishlist"
                />
            </nav>
        </Portal>
    )
}
interface TabButtonProps {
    icon: React.ElementType;
    label: string;
    active: boolean;
    href: string;
}

function TabButton({ icon: Icon, label, active, href }: TabButtonProps) {
    return (
        <Link
            href={href}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${active
                ? 'text-amber-500'
                : 'text-zinc-500 hover:text-zinc-300'
                }`}
        >
            <Icon className="w-6 h-6" strokeWidth={active ? 2 : 1.5} />
            <span className="text-xs">{label}</span>
        </Link>
    );
}