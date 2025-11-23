'use client'

import { addToCollection, searchVinyls } from '@/app/actions'
import { DiscogsResult, DiscogsSearchResponse } from '@/lib/discogs'
import { Disc, Loader2, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

export default function SearchInterface() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<DiscogsResult[]>([])
    const [pagination, setPagination] = useState({ page: 1, pages: 1 })
    const [loading, setLoading] = useState(false)
    const [addingId, setAddingId] = useState<number | null>(null)

    const handleSearch = async (e?: React.FormEvent, page: number = 1) => {
        e?.preventDefault()
        if (!query.trim()) return

        setLoading(true)
        try {
            console.log('Searching for', query, 'page', page)
            const formData = new FormData()
            formData.append('query', query)
            formData.append('page', page.toString())

            const data: DiscogsSearchResponse = await searchVinyls(formData)
            setResults(data.results || [])
            setPagination({ page: data.pagination.page, pages: data.pagination.pages })
        } catch (error) {
            console.error('Search failed', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = async (vinyl: DiscogsResult) => {
        setAddingId(vinyl.id)
        try {
            // Extract artist and title from Discogs format "Artist - Title"
            const [artist, title] = vinyl.title.split(' - ').map((s) => s.trim())

            await addToCollection({
                title: title || vinyl.title, // Fallback if split fails
                artist: artist || 'Unknown Artist',
                year: vinyl.year || '',
                cover_image: vinyl.cover_image || vinyl.thumb || '',
                discogs_id: vinyl.id,
            })
        } catch (error) {
            console.error('Add failed', error)
            setAddingId(null)
        }
    }

    return (
        <div className="space-y-8">
            <form onSubmit={(e) => handleSearch(e, 1)} className="relative max-w-2xl mx-auto">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for artist, album, or track..."
                    className="w-full h-14 pl-12 pr-4 rounded-full bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary text-lg transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-6 h-6" />
                <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-full bg-primary text-white font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
                </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((result) => (
                    <div
                        key={result.id}
                        className="group relative bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300"
                    >
                        <div className="aspect-square relative bg-black/40">
                            {result.cover_image || result.thumb ? (
                                <Image
                                    src={result.cover_image || result.thumb || ''}
                                    alt={result.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                    <Disc className="w-12 h-12 opacity-20" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={() => handleAdd(result)}
                                    disabled={addingId === result.id}
                                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 disabled:opacity-75"
                                >
                                    {addingId === result.id ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Plus className="w-5 h-5" />
                                            Add to Collection
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-lg truncate" title={result.title}>
                                {result.title}
                            </h3>
                            <p className="text-muted-foreground text-sm">{result.year}</p>
                        </div>
                    </div>
                ))}
            </div>

            {results.length > 0 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                        onClick={() => handleSearch(undefined, pagination.page - 1)}
                        disabled={pagination.page <= 1 || loading}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <span className="text-muted-foreground">
                        Page {pagination.page} of {pagination.pages}
                    </span>
                    <button
                        onClick={() => handleSearch(undefined, pagination.page + 1)}
                        disabled={pagination.page >= pagination.pages || loading}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            )}

            {results.length === 0 && !loading && query && (
                <div className="text-center py-20 text-muted-foreground">
                    No results found for "{query}"
                </div>
            )}
        </div>
    )
}
