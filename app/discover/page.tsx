import { AlbumCardDrawer } from "@/components/card"
import HeroCard from "@/components/heroCard"
import { getTopAlbums } from "@/lib/recomendations"

export default async function DiscoverPage() {
    const { results } = await getTopAlbums()
    return (
        <div className="container mx-auto px-4 mt-8">
            <HeroCard />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 my-8">
                {results.map((album: any) => (
                    <AlbumCardDrawer key={album.id} album={album} />
                ))}
            </div>
        </div>
    )
}
