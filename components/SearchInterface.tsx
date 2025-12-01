'use client'

import { addToCollection, searchVinyls } from '@/app/actions'
import { DiscogsResult, DiscogsSearchResponse } from '@/lib/discogs'
import { Disc, Loader2, Plus, Search, ChevronLeft, ChevronRight, Goal } from 'lucide-react'
import Image from 'next/image'
import { redirect, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SearchInterface() {
    const navigate = useRouter()
    const [query, setQuery] = useState('')
    const [format, setFormat] = useState('vinyl')
    const [results, setResults] = useState<DiscogsResult[]>([])
    const [pagination, setPagination] = useState({ page: 1, pages: 1 })
    const [loading, setLoading] = useState(false)
    const [addingId, setAddingId] = useState<number | null>(null)

    const handleSearch = async (e?: React.FormEvent, page: number = 1) => {
        e?.preventDefault()
        if (!query.trim()) return

        setLoading(true)
        try {
            console.log('Searching for', query, 'format', format, 'page', page)
            const formData = new FormData()
            formData.append('query', query)
            formData.append('format', format)
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

    const handleAdd = async (vinyl: DiscogsResult, owned: boolean = true) => {
        setAddingId(vinyl.id)
        try {
            const [artist, title] = vinyl.title.split(' - ').map((s) => s.trim())

            await addToCollection({
                title: title || vinyl.title,
                artist: artist || 'Unknown Artist',
                year: vinyl.year || '',
                cover_image: vinyl.cover_image || vinyl.thumb || '',
                discogs_id: vinyl.id,
                owned,
            })

            if (owned) {
                navigate.push('/dashboard')
            } else {
                navigate.push('/wishlist')
            }
        } catch (error) {
            console.error('Add failed', error)
            setAddingId(null)
        }
    }

    return (
        <div className="space-y-8">
            <form onSubmit={(e) => handleSearch(e, 1)} className="relative max-w-2xl mx-auto flex gap-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for artist, album, or track..."
                        className="w-full h-14 pl-12 pr-4 rounded-full bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary text-lg transition-all"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-6 h-6" />
                </div>

                {/* <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="h-14 px-6 rounded-full bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary text-lg transition-all outline-none appearance-none cursor-pointer hover:bg-white/10"
                >
                    <option value="vinyl" className="bg-zinc-900">Vinyl</option>
                    <option value="cd" className="bg-zinc-900">CD</option>
                    <option value="cassette" className="bg-zinc-900">Cassette</option>
                    <option value="all" className="bg-zinc-900">All Formats</option>
                </select> */}

                <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="px-8 h-14 rounded-full bg-primary text-white font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors flex items-center justify-center min-w-[100px]"
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
                        </div>
                        <div className="p-4 space-y-3">
                            <div>
                                <h3 className="font-bold text-lg truncate" title={result.title}>
                                    {result.title}
                                </h3>
                                <p className="text-muted-foreground text-sm">{result.year}</p>
                            </div>

                            {/* Action buttons - always visible, mobile-friendly */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleAdd(result)}
                                    disabled={addingId === result.id}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-black font-medium transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
                                    title="Add to Collection"
                                >
                                    {addingId === result.id ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Plus className="w-5 h-5 flex-shrink-0" />
                                            <span className="hidden sm:inline">Collection</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => handleAdd(result, false)}
                                    disabled={addingId === result.id}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/10 text-black font-medium transition-all hover:bg-white/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 min-h-[48px]"
                                    title="Add to Wishlist"
                                >
                                    {addingId === result.id ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Goal className="w-5 h-5 flex-shrink-0" />
                                            <span className="hidden sm:inline">Wishlist</span>
                                        </>
                                    )}
                                </button>
                            </div>
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
