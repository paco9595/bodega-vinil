import { createClient } from "@/utils/supabase/server";
import { getRelease } from "@/lib/discogs";
import Image from "next/image";
import { Disc, Music, PlayCircle } from "lucide-react";


export default async function AlbumPage({ params }: { params: Promise<{ id_album: string }> }) {
    const supabase = await createClient();
    const idAlbum = (await params)?.id_album

    const { data: vinyl } = await supabase
        .from('vinyls')
        .select('id, title, artist, year, cover_image, discogs_id')
        .eq('id', idAlbum)
        .single()

    if (!vinyl) {
        return <div className="p-8 text-center">Album not found</div>
    }

    let release = null
    if (vinyl.discogs_id) {
        release = await getRelease(vinyl.discogs_id)
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero Section */}
            <div className="relative h-[40vh] w-full overflow-hidden">
                <div className="absolute inset-0 bg-black/60 z-10" />
                {vinyl.cover_image && (
                    <Image
                        src={vinyl.cover_image}
                        alt={vinyl.title}
                        fill
                        className="object-cover blur-xl opacity-50"
                    />
                )}
                <div className="absolute inset-0 z-20 flex items-end pb-10 container mx-auto px-4">
                    <div className="flex flex-col justify-center md:justify-start  md:flex-row gap-8 w-full">
                        <div className="mx-auto md:mx-0 relative w-48 h-48 md:w-64 md:h-64 rounded-xl overflow-hidden shadow-2xl border border-white/10 shrink-0">
                            {vinyl.cover_image ? (
                                <Image
                                    src={vinyl.cover_image}
                                    alt={vinyl.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                    <Disc className="w-20 h-20 text-white/20" />
                                </div>
                            )}
                        </div>
                        <div className="mx-auto md:mx-0 space-y-4 mb-2 mt-auto">
                            <h1 className="text-4xl md:text-6xl font-bold text-white">{vinyl.title}</h1>
                            <div className="flex items-center gap-4 text-xl text-gray-200">
                                <span className="font-medium">{vinyl.artist}</span>
                                <span>•</span>
                                <span>{vinyl.year}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tracklist Section */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Music className="w-6 h-6 text-primary" />
                    Tracklist
                </h2>

                {release?.tracklist ? (
                    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                        <div className="divide-y divide-white/5">
                            {release.tracklist.map((track, index) => (
                                <div key={index} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <span className="text-muted-foreground w-8 text-right font-mono text-sm">
                                            {track.position}
                                        </span>
                                        <span className="font-medium text-lg">{track.title}</span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-sm text-muted-foreground font-mono">
                                            {track.duration}
                                        </span>
                                        <a
                                            href={`https://open.spotify.com/search/${encodeURIComponent(`${vinyl.artist} ${track.title}`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-full bg-[#1DB954] text-black opacity-0 group-hover:opacity-100 transition-all hover:scale-105"
                                            title="Play on Spotify"
                                        >
                                            <PlayCircle className="w-5 h-5" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground bg-white/5 rounded-xl border border-white/10">
                        No tracklist available from Discogs
                    </div>
                )}
            </div>
        </div>
    )
}