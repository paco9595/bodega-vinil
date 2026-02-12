import { DiscogsRelease } from "@/lib/types/DiscogsRelease";
import { useState } from "react";
import { Heart, Plus } from "lucide-react";
import { AlbumDrawer } from "./card";

interface SearchResultItemProps {
    album: DiscogsRelease;
}

export function SearchResultItem({ album }: SearchResultItemProps) {
    const [inCollection, setInCollection] = useState(false);
    const [inWishlist, setInWishlist] = useState(false);

    return (
        <div className="flex items-center gap-4 p-3 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
            <AlbumDrawer album={album as any}>
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <img
                        src={album?.images?.[0].uri || ''}
                        alt={album.title}
                        className="w-16 h-16 rounded-lg object-cover shadow-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 text-left">
                        <p className="font-medium text-sm line-clamp-1">{album.title}</p>
                        <p className="text-xs text-zinc-400">{album.artists?.[0].name}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">
                            {album?.year} • {album?.genres?.[0]}
                        </p>
                    </div>
                </div>
            </AlbumDrawer>
            <div className="flex gap-2 flex-shrink-0">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setInCollection(!inCollection);
                    }}
                    className={`p-2 rounded-lg transition-colors ${inCollection
                        ? 'bg-amber-500 text-white'
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                        }`}
                >
                    <Plus className="w-4 h-4" />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setInWishlist(!inWishlist);
                    }}
                    className={`p-2 rounded-lg transition-colors ${inWishlist
                        ? 'bg-red-500 text-white'
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                        }`}
                >
                    <Heart className="w-4 h-4" fill={inWishlist ? 'currentColor' : 'none'} />
                </button>
            </div>
        </div>
    );
}