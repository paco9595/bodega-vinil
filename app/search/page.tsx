import SearchInterface from '@/components/SearchInterface'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
    title: "Search Records",
    description: "Search the Discogs database for vinyl records to add to your collection.",
};

export default function SearchPage() {
    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                        Find Your Records
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Search the Discogs database to add to your collection
                    </p>
                </div>

                <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
                    <SearchInterface />
                </Suspense>
            </main>
        </div>
    )
}
