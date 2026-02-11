import SearchInterface from '@/components/SearchInterface'
import { Metadata } from 'next'
import { getRecomendations, getTopAlbums } from '@/lib/recomendations'
import { getTopArtists, getTopTags } from '@/lib/lastfm'
import Carrusel from '@/components/Carrusel'

export const metadata: Metadata = {
    title: "Search Records",
    description: "Search the Discogs database for vinyl records to add to your collection.",
};

export default async function SearchPage(props: { searchParams: Promise<{ q?: string }> }) {
    const searchParams = await props.searchParams
    const { results: recomendations } = await getRecomendations()
    const topArtist = await getTopArtists()
    const topTags = await getTopTags()
    const topAlbums = await getTopAlbums()
    const query = searchParams.q || ''
    console.log({ recomendations, topAlbums })

    return (
        <main className="container mx-auto py-8 flex flex-col gap-8 px-4 h-full overflow-y-auto">
            <SearchInterface />
            {!query && (
                <>
                    <Carrusel records={recomendations || []} title="Recomendations" />
                    <Carrusel records={topArtist || []} title="Top Artists" style='top' />
                    {topTags.map((tag: any) => (
                        <Carrusel key={tag.tag} records={tag.results || []} title={tag.tag} />
                    ))}
                </>
            )}
        </main>
    )
}
