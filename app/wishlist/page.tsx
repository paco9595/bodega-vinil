'use client'
import ShareModal from "@/components/ShareModal"
import { Heart } from "lucide-react"
import { WishListcart } from "@/components/wishListCart"
import useWishlist from "@/hooks/useWistList"
import { Spinner } from "@/components/ui/spinner"

export default function WishListPage() {
    const { wishlist, isLoading, addToCollectionFormWishList } = useWishlist()

    return (
        <div className="container mx-auto px-6 flex-1">
            {!isLoading ? <>
                <div className="flex items-center justify-between my-10">
                    <div>
                        <h2 className="text-2xl font-light mb-2">Wishlist</h2>
                        <p className="text-zinc-400 text-sm">{wishlist.length} albums</p>
                    </div>
                    <ShareModal />
                </div>
                {wishlist.length > 0 ? (
                    <div className="space-y-3">
                        {wishlist.map((album) => (
                            <WishListcart key={album.id} album={album as any} addHandler={addToCollectionFormWishList} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-8 h-8 text-zinc-600" />
                        </div>
                        <p className="text-zinc-500">Your wishlist is empty</p>
                        <p className="text-sm text-zinc-600 mt-1">Add albums you want to collect</p>
                    </div>
                )}
            </> :
                <div className="flex flex-1  justify-center items-center h-full">
                    <Spinner />
                </div>
            }
        </div>
    )
}

