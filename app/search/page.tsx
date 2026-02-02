import SearchInterface from '@/components/SearchInterface'
import { Metadata } from 'next'
import { Suspense } from 'react'
import Carrusel from '@/components/carrusel'
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
    console.log({ topArtist, recomendations })
    return (
        <div className="flex flex-col">
            <main className="container mx-auto py-8">
                <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
                    <SearchInterface />
                </Suspense>
                <Carrusel records={recomendations || []} title="Recomendations" />
                <Carrusel records={topArtist || []} title="Top Artists" />
                {topTags.map((tag: any) => (
                    <Carrusel key={tag.tag} records={tag.results || []} title={tag.tag} />
                ))}
            </main>
        </div>
    )
}
