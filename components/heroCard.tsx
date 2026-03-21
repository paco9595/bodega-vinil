import { createClient } from "@/utils/supabase/server"
import Link from "next/link"

export default async function HeroCard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Default values if no album is found or no user
    let displayAlbum = {
        id: null as string | null,
        title: "Random Access Memories",
        artist: "Daft Punk",
        year: "2013",
        cover_image: null as string | null,
        label: "Featured Album"
    }

    if (user) {
        const { data: albums } = await supabase
            .from('vinyls')
            .select('*')
            .eq('user_id', user.id)
            .eq('owned', true)
            .order('created_at', { ascending: false })
            .limit(1)

        if (albums && albums.length > 0) {
            const lastAlbum = albums[0]
            displayAlbum = {
                id: lastAlbum.id,
                title: lastAlbum.title,
                artist: lastAlbum.artist,
                year: lastAlbum.year || "",
                cover_image: lastAlbum.cover_image,
                label: "Last Added"
            }
        }
    }

    const CardContent = (
        <div className="relative h-64 rounded-3xl overflow-hidden bg-gradient-to-br from-amber-600 via-orange-700 to-red-900 p-6 flex flex-col justify-end shadow-2xl group cursor-pointer transition-all duration-500">
            {displayAlbum.cover_image && (
                <>
                    <img
                        src={displayAlbum.cover_image}
                        alt={displayAlbum.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                </>
            )}
            <div className="relative z-10">
                <p className="text-amber-200 text-sm mb-2 font-medium tracking-wider uppercase drop-shadow-md">{displayAlbum.label}</p>
                <h2 className="text-3xl md:text-4xl font-bold mb-1 tracking-tight text-white drop-shadow-lg">{displayAlbum.title}</h2>
                <p className="text-zinc-100 text-lg font-light drop-shadow-md">{displayAlbum.artist} {displayAlbum.year ? `• ${displayAlbum.year}` : ''}</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </div>
    )

    return (
        <section>
            {displayAlbum.id ? (
                <Link href={`/collection/album/${displayAlbum.id}`}>
                    {CardContent}
                </Link>
            ) : (
                CardContent
            )}
        </section>
    )
}
