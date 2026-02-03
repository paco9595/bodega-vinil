
import SearchInterface from '@/components/SearchInterface'
import { Metadata } from 'next'
import { getRecomendations } from '@/lib/recomendations'
import { getTopArtists, getTopTags } from '@/lib/lastfm'

export const metadata: Metadata = {
    title: "Search Records",
    description: "Search the Discogs database for vinyl records to add to your collection.",
};

export default async function SearchPage() {
    const { results: recomendations } = await getRecomendations()
    const topArtist = await getTopArtists()
    const topTags = await getTopTags()
    return (
        <main className="container mx-auto py-8 flex flex-col gap-8 px-4">
            <SearchInterface />
            {/* <Carrusel records={recomendations || []} title="Recomendations" />
                <Carrusel records={topArtist || []} title="Top Artists" style='top' />
                {topTags.map((tag: any) => (
                    <Carrusel key={tag.tag} records={tag.results || []} title={tag.tag} />
                ))} */}
        </main>
    )
}
