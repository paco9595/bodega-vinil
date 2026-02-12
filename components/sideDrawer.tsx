import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { createClient } from "@/utils/supabase/server"
import { Earth, Heart, LogOut, Menu, Settings, User, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"


export async function SideDrawer() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return (
        <Drawer
            direction={"left"}
        >
            <DrawerTrigger asChild>
                <Button variant="outline" className="capitalize">
                    <Menu />
                </Button>
            </DrawerTrigger>

            <DrawerContent className="grid grid-rows-[auto_1fr_auto] h-full max-h-screen w-[80%] max-w-[400px] ">
                <DrawerHeader className="flex justify-between">
                    <DrawerTitle>
                        <div className="font-bold text-xl">Menu</div>
                    </DrawerTitle>
                    <DrawerClose>
                        <X />
                    </DrawerClose>
                </DrawerHeader>
                <div className="flex-1 flex flex-col border-y border-white/10">
                    <div className="px-8">
                        <div className="flex flex-col gap-4  pb-4 border-white/10">
                            <div className="flex gap-4 pt-4">
                                <div className="relative h-16 w-16"><Image fill src="https://placehold.co/600x400.png" alt="Logo" className="rounded-full" /></div>
                                <div className="flex flex-col justify-center">
                                    <div>{user?.user_metadata.full_name}</div>
                                    <div className="text-ellipsis overflow-hidden max-w-[185px]">{user?.email}</div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div>
                                    <div className="font-light text-lg text-white/50">Collection</div>
                                    <div className="font-bold text-lg">41</div>
                                </div>
                                <div>
                                    <div className="font-light text-lg text-white/50">Wish List</div>
                                    <div className="font-bold text-lg">100</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-white/10 px-8">
                        <div className="py-8">
                            <ul>
                                <li className="pb-8">
                                    <Link href="/collection" className="flex items-center gap-2">
                                        <User />
                                        <div>Profile</div>
                                    </Link>
                                </li>
                                <li className="pb-8">
                                    <Link href="/discover" className="flex items-center gap-2">
                                        <Earth />
                                        <div>Discover</div>
                                    </Link>
                                </li>
                                <li className="pb-8">
                                    <Link href="/wishlist" className="flex items-center gap-2">
                                        <Heart />
                                        <div>Wish List</div>
                                    </Link>
                                </li>
                                <li className="pb-8">
                                    <Link href="/settings" className="flex items-center gap-2">
                                        <Settings />
                                        <div>Settings</div>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button variant="ghost" className="w-full flex justify-start text-orange-600">
                            <LogOut />
                            <div>Logout</div>
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
