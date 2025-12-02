import { getRelease } from "@/lib/discogs";
import Image from "next/image";
import { Disc, Music, PlayCircle } from "lucide-react";
import { createAdminClient } from "@/utils/supabase/server";

// Type for album display data (subset of full Vinyl type)
type AlbumData = {
    title: string
    artist: string
    year: string | null
    cover_image: string | null
    discogs_id?: number | null
}

export async function generateStaticParams() {
    const supabase = createAdminClient();
    const { data: vinyls } = await supabase
        .from('vinyls')
        .select('id')
    return vinyls?.map((vinyl) => ({ id_album: vinyl.id })) || []
}

export default async function AlbumPage({ params }: { params: Promise<{ id_album: string }> }) {
    const { id_album } = await params
    const supabase = createAdminClient();

    // Try to get vinyl from database
    const { data: vinyl } = await supabase
        .from('vinyls')
        .select('*')
        .eq('id', id_album)
        .single()

    let release = null
    let albumData: AlbumData | null = vinyl

    // If vinyl not found in database, try to get it from Discogs
    if (!vinyl) {
        // Assume id_album is a Discogs release ID
        release = await getRelease(Number(id_album))

        if (!release) {
            return <div className="p-8 text-center">Album not found</div>
        }

        // Use Discogs data as album data
        albumData = {
            title: release.title,
            artist: release.artists?.[0]?.name || 'Unknown Artist',
            year: release.year?.toString() || null,
            cover_image: release.cover_image || release.images?.[0]?.uri || null,
            discogs_id: release.id
        }
    } else {
        // Get detailed release information from Discogs if available
        release = vinyl.discogs_id ? await getRelease(vinyl.discogs_id) : null
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero Section */}
            <div className="relative h-[40vh] w-full overflow-hidden">
                <div className="absolute inset-0 bg-black/60 z-10" />
                {albumData?.cover_image && (
                    <Image
                        src={albumData.cover_image}
                        alt={albumData.title}
                        fill
                        className="object-cover blur-xl opacity-50"
                    />
                )}
                <div className="absolute inset-0 z-20 flex items-end pb-10 container mx-auto px-4">
                    <div className="flex flex-col justify-center md:justify-start  md:flex-row gap-8 w-full">
                        <div className="mx-auto md:mx-0 relative w-48 h-48 md:w-64 md:h-64 rounded-xl overflow-hidden shadow-2xl border border-white/10 shrink-0">
                            {albumData?.cover_image ? (
                                <Image
                                    src={albumData.cover_image}
                                    alt={albumData.title}
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
                            <h1 className="text-4xl md:text-6xl font-bold text-white">{albumData?.title}</h1>
                            <div className="flex items-center gap-4 text-xl text-gray-200">
                                <span className="font-medium">{albumData?.artist}</span>
                                <span>•</span>
                                <span>{albumData?.year}</span>
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
                                            href={`https://open.spotify.com/search/${encodeURIComponent(`${albumData.artist} ${track.title}`)}`}
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