import CollectionStats from "@/components/CollectionStats";
import ShareModal from "@/components/ShareModal";
import ProfileNameEditor from "@/components/ProfileNameEditor";
import getServerUser from "@/hooks/useServerUser";

export default async function ProfilePage() {
    const { supabase, user } = await getServerUser()

    const { data: vinyls } = await supabase
        .from('vinyls')
        .select('*')
        .filter('owned', 'eq', true)

    const ownedVinyls = vinyls || []
    const genreCounts: Record<string, number> = {}
    const artistCounts: Record<string, number> = {}
    let oldestCollectionDate: Date | null = null

    // for...of (no forEach) para que TypeScript rastree asignaciones a `oldestCollectionDate` en el build
    for (const vinyl of ownedVinyls) {
        if (vinyl.artist) {
            artistCounts[vinyl.artist] = (artistCounts[vinyl.artist] || 0) + 1
        }

        if (vinyl.created_at) {
            const createdAtDate = new Date(vinyl.created_at)
            if (!oldestCollectionDate || createdAtDate < oldestCollectionDate) {
                oldestCollectionDate = createdAtDate
            }
        }

        const releaseData = vinyl.release_data as { genres?: string[] } | null
        releaseData?.genres?.forEach((genre) => {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1
        })
    }

    const favoriteGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Sin datos"
    const topArtist = Object.entries(artistCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Sin datos"
    const collectionYears = oldestCollectionDate
        ? Math.max(1, new Date().getFullYear() - oldestCollectionDate?.getFullYear())
        : null

    const initialName = user?.user_metadata?.full_name || user?.user_metadata?.name || ""

    return (
        <main className="flex-1 mx-auto px-6 py-8 overflow-y-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-8 mb-8">
                <div className="flex items-center gap-2">
                <img src={user?.identities?.[0]?.identity_data?.avatar_url} alt={user?.user_metadata?.full_name} className="w-24 h-24 rounded-full" />
                <div className="ml-4">
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold text-2xl">{user?.user_metadata?.full_name}</p>
                            <ProfileNameEditor initialName={initialName} />
                        </div>
                        <p className="text-muted-foreground">{user?.email}</p>
                    </div>
                </div>
                <div className="w-full md:w-fit">
                    <ShareModal page="collection" title="Compartir colección" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                    <p className="text-sm text-muted-foreground mb-1">Años coleccionando</p>
                    <p className="text-2xl font-bold">{collectionYears ? `${collectionYears} años` : "Sin datos"}</p>
                </div>
                <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                    <p className="text-sm text-muted-foreground mb-1">Género favorito</p>
                    <p className="text-2xl font-bold">{favoriteGenre}</p>
                </div>
                <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                    <p className="text-sm text-muted-foreground mb-1">Artista más repetido</p>
                    <p className="text-2xl font-bold truncate">{topArtist}</p>
                </div>
            </div>
            <div className="flex flex-col gap-6 mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Collection Insights</h1>
                    <p className="text-muted-foreground">
                        Analyze your collecting habits, top artists, and estimated value.
                    </p>
                </div>
            </div>

            <CollectionStats vinyls={ownedVinyls} />
        </main>
    )
}