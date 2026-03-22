'use client';

import { getTracks, getArtistReleases } from "@/lib/tracklist";
import { Artist, DiscogsRelease } from "@/lib/types/DiscogsRelease";
import { Check, Heart, Plus, Share2, X, ExternalLink } from "lucide-react";
import Link from 'next/link';
import Image from "next/image";
import { useState, useEffect } from "react";
import { DrawerClose, DrawerDescription, DrawerTitle } from "./ui/drawer";
import { Vinyl } from "@/lib/types/tables";

import { addToCollectionFromSearch } from "@/hooks/useWistList";

type AlbumDetailModalProps = {
    album: DiscogsRelease & Partial<Vinyl>
    initialInCollection?: boolean
    initialInWishlist?: boolean
    readOnly?: boolean
}
export default function AlbumDetailModal({ album, initialInCollection, initialInWishlist, readOnly }: AlbumDetailModalProps) {
    const [tracklist, setTracklist] = useState<any[]>([]);
    const [inCollection, setInCollection] = useState(initialInCollection ?? album.owned === true);
    const [inWishlist, setInWishlist] = useState(initialInWishlist ?? false);

    const isArtist = (album as any).type === 'artist';
    const [artistReleases, setArtistReleases] = useState<any[]>([]);

    useEffect(() => {
        if (initialInCollection !== undefined) setInCollection(initialInCollection);
    }, [initialInCollection]);

    useEffect(() => {
        if (initialInWishlist !== undefined) setInWishlist(initialInWishlist);
    }, [initialInWishlist]);

    useEffect(() => {
        if (isArtist) {
            async function fetchReleases() {
                try {
                    const data = await getArtistReleases(String(album.id));
                    setArtistReleases(data.releases || []);
                } catch (error) {
                    console.error("Failed to fetch artist releases", error);
                }
            }
            fetchReleases();
        } else {
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
        }
    }, [isArtist, album?.id, album?.tracklist, album?.master_id, album?.discogs_id]);

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
                <div className={!readOnly ? "pb-8 absolute -bottom-20  z-10 px-8 opacity-50" : "absolute -bottom-20  z-10 px-8"}>
                    {/* Album Info */}
                    <div className={!readOnly ? "mb-6" : ""}>
                        <DrawerTitle asChild>

                            <h2 className="text-3xl font-light mb-2">{album.title}</h2>
                        </DrawerTitle>
                        <DrawerDescription asChild>
                            <div>
                                <p className="text-xl text-zinc-300 mb-2">{album.artists?.map((artist: Artist) => artist.name).join(', ')}</p>
                                <p className="text-sm text-zinc-400">
                                    {album.year} • {album.genres?.join(', ')}
                                </p>
                            </div>
                        </DrawerDescription>
                    </div>
                </div>
            </div>
            <div>
                {!readOnly ? (
                    <div className="flex gap-3 my-8 px-8">
                        <button
                            onClick={() => {
                                setInCollection(!inCollection);
                                addToCollectionFromSearch(album.id, true);
                            }}
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
                            onClick={() => {
                                setInWishlist(!inWishlist);
                                addToCollectionFromSearch(album.id, false);
                            }}
                            className={`p-4 rounded-2xl transition-colors flex items-center justify-center ${inWishlist
                                ? 'bg-red-500 text-white'
                                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                                }`}
                        >
                            <Heart className="w-5 h-5" fill={inWishlist ? 'currentColor' : 'none'} />
                        </button>
                        <Link 
                            href={`/collection/album/${album.id}`}
                            className="p-4 bg-zinc-800 text-zinc-300 rounded-2xl hover:bg-zinc-700 transition-colors flex items-center justify-center"
                        >
                            <ExternalLink className="w-5 h-5" />
                        </Link>
                        <button className="p-4 bg-zinc-800 text-zinc-300 rounded-2xl hover:bg-zinc-700 transition-colors flex items-center justify-center">
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-3 my-8 px-8">
                        <Link 
                            href={`/collection/album/${album.id}`}
                            className="flex-1 p-4 bg-zinc-800 text-zinc-300 rounded-2xl hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <ExternalLink className="w-5 h-5" />
                            <span>Ver detalles del álbum</span>
                        </Link>
                    </div>
                )}
            </div>
            {/* Tracklist / Releases Section */}
            <div className="flex-1 overflow-y-auto px-8 pb-8">
                <h3 className="text-xl font-semibold mb-4 text-white/50">{isArtist ? 'Releases' : 'Tracklist'}</h3>
                {isArtist ? (
                    <div className="space-y-4">
                        {artistReleases.map((release: any, index: number) => (
                            <div key={index} className="flex gap-4 items-center text-zinc-300">
                                <Image src={release.thumb || '/placeholder.png'} width={48} height={48} className="rounded object-cover w-12 h-12" alt={release.title} />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-white line-clamp-1">{release.title}</p>
                                    <p className="text-sm text-zinc-500">{release.year}</p>
                                </div>
                            </div>
                        ))}
                        {artistReleases.length === 0 && <p className="text-zinc-500 text-sm">No releases available.</p>}
                    </div>
                ) : (
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
                )}
            </div>
        </div>
    )
}