import { ArrowRight } from "lucide-react";
import { DiscogsRelease } from "@/lib/validations/discogs";
import { Vinyl } from "@/lib/types/tables";

export function WishListcart({ album, addHandler }: { album: DiscogsRelease & Partial<Vinyl>, addHandler: (albumId: string) => void }) {
    const imageUrl = Array.isArray(album.images) ? album.images[0].uri : (album.cover_image ?? album.thumb);
    return (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-800/50 hover:bg-zinc-900 transition-colors mb-8">
            <button className="flex items-center gap-4 flex-1 min-w-0">
                <img
                    src={imageUrl}
                    alt={album.title}
                    className="w-20 h-20 rounded-xl object-cover shadow-lg"
                />
                <div className="flex-1 min-w-0 text-left">
                    <p className="font-medium line-clamp-1">{album.title}</p>
                    <p className="text-sm text-zinc-400 mt-0.5">{album.artist}</p>
                    <p className="text-xs text-zinc-500 mt-1">
                        {album.year} •
                    </p>
                </div>
            </button>
            <button
                onClick={() => addHandler(album.id)}
                className="shrink-0 flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium transition-colors"
            >
                <span>Add</span>
                <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    )
}