'use client';

import { getTracks } from "@/lib/tracklist";
import { DiscogsRelease } from "@/lib/types/DiscogsRelease";
import { Check, Heart, Plus, Share2, X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { DrawerClose, DrawerDescription, DrawerTitle } from "./ui/drawer";
import { Vinyl } from "@/lib/types/tables";

type AlbumDetailModalProps = {
    album: DiscogsRelease & Partial<Vinyl>
}
export default function AlbumDetailModal({ album }: AlbumDetailModalProps) {
    const [tracklist, setTracklist] = useState<any[]>([]);
    const [inCollection, setInCollection] = useState(false);
    const [inWishlist, setInWishlist] = useState(false);

    useEffect(() => {
        async function fetchTracks() {
            const id = album?.master_id || album?.discogs_id
            if (id) {
                try {
                    const data = await getTracks(id.toString());
                    console.log({ tracklist: data.tracklist });
                    setTracklist(data.tracklist || []);
                } catch (error) {
                    console.error("Failed to fetch tracks", error);
                }
            }
        }
        if (album.tracklist && album.tracklist.length > 0) {
            setTracklist(album.tracklist);
        } else {
            fetchTracks();
        }
    }, [album?.master_id, album?.discogs_id]);

    const imageUrl = Array.isArray(album.images) ? album.images[0].uri : (album.cover_image ?? album.thumb);
    return (
        <div className="h-[80vh] flex flex-col">
            <div className="relative w-full h-96 rounded-t-4xl ">
                <div className="relative w-full h-full inset-shadow-black  inset-shadow-sm">

                    <Image src={imageUrl || '/placeholder.png'} alt={album.title} fill className=" rounded-t-4xl" />
                    <DrawerClose className="absolute top-4 right-4  bg-black/80 backdrop-blur-sm rounded-full p-2">
                        <X />
                    </DrawerClose>
                    <div className="absolute -bottom-px  inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
                </div>
                <div className="pb-8 absolute -bottom-20  z-10 px-8">
                    {/* Album Info */}
                    <div className="mb-6">
                        <DrawerTitle asChild>

                            <h2 className="text-3xl font-light mb-2">{album.title}</h2>
                        </DrawerTitle>
                        <DrawerDescription asChild>
                            <div>
                                <p className="text-xl text-zinc-300 mb-2">{album.artists?.map((artist) => artist.name).join(', ')}</p>
                                <p className="text-sm text-zinc-400">
                                    {album.year} • {album.genres?.join(', ')}
                                </p>
                            </div>
                        </DrawerDescription>
                    </div>
                </div>
            </div>
            <div>
                <div className="flex gap-3 my-8 px-8">
                    <button
                        onClick={() => setInCollection(!inCollection)}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-medium transition-all shadow-lg ${inCollection
                            ? 'bg-amber-600 text-white'
                            : 'bg-amber-500 hover:bg-amber-600 text-white'
                            }`}
                    >
                        {inCollection ? (
                            <>
                                <Check className="w-5 h-5" />
                                <span>In Collection</span>
                            </>
                        ) : (
                            <>
                                <Plus className="w-5 h-5" />
                                <span>Add to Collection</span>
                            </>
                        )}
                    </button>
                    <button
                        onClick={() => setInWishlist(!inWishlist)}
                        className={`p-4 rounded-2xl transition-colors ${inWishlist
                            ? 'bg-red-500 text-white'
                            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                            }`}
                    >
                        <Heart className="w-5 h-5" fill={inWishlist ? 'currentColor' : 'none'} />
                    </button>
                    <button className="p-4 bg-zinc-800 text-zinc-300 rounded-2xl hover:bg-zinc-700 transition-colors">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
            {/* Tracklist Section */}
            <div className="flex-1 overflow-y-auto px-8 pb-8">
                <h3 className="text-xl font-semibold mb-4 text-white/50">Tracklist</h3>
                <div className="space-y-4">
                    {tracklist.map((track: any, index: number) => (
                        <div key={index} className="flex justify-between items-center text-zinc-300">
                            <div className="flex gap-4 items-center">
                                <span className="text-zinc-500 w-6 text-sm">{track.position}</span>
                                <span className="font-medium">{track.title}</span>
                            </div>
                            <span className="text-sm text-zinc-500">{track.duration}</span>
                        </div>
                    ))}
                    {tracklist.length === 0 && <p className="text-zinc-500 text-sm">No tracks available.</p>}
                </div>
            </div>
        </div>
    )
}