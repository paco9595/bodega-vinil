'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Search, ArrowUp, ArrowDown, ArrowUpDown, Plus } from 'lucide-react'
import { useState, useMemo, useCallback } from 'react'
import { NormalizeString, NormalizeYear } from '@/utils/utilits'
import { addToCollection, wishlistToCollection } from '@/app/actions'
import { Vinyl } from '@/lib/types/tables'
import { DiscogsRelease } from '@/lib/types/DiscogsRelease'
import { toast } from 'sonner'

interface VinylTableProps {
    vinyls: Vinyl[]
    isLogin?: boolean
    genres: string[]
}

export default function VinylTable({ vinyls, isLogin = false, genres }: VinylTableProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [genreFilter, setGenreFilter] = useState<string>('all')
    const [sortColumn, setSortColumn] = useState<keyof Vinyl | null>(null)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

    const handleSort = useCallback((column: keyof Vinyl) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
    }, [sortColumn, sortDirection])

    // Memoize filtered and sorted vinyls to prevent recalculation on every render
    const filteredVinyls = useMemo(() => {
        return vinyls.filter((vinyl) => {
            const query = NormalizeString(searchQuery)
            const matchesSearch = (
                NormalizeString(vinyl.title).includes(query) ||
                NormalizeString(vinyl.artist).includes(query) ||
                (NormalizeYear(vinyl.year || '').includes(query) ?? false)
            )

            const releaseData = vinyl.release_data as unknown as DiscogsRelease
            const matchesGenre = genreFilter === 'all' ||
                (releaseData?.genres || []).includes(genreFilter)

            return matchesSearch && matchesGenre
        }).sort((a, b) => {
            if (!sortColumn) return 0

            const aValue = a[sortColumn]
            const bValue = b[sortColumn]

            if (aValue === bValue) return 0
            if (aValue === null) return 1
            if (bValue === null) return -1

            const compareResult = aValue.toString().localeCompare(bValue.toString(), undefined, { numeric: true })

            return sortDirection === 'asc' ? compareResult : -compareResult
        })
    }, [vinyls, searchQuery, genreFilter, sortColumn, sortDirection])

    // Memoize pagination calculations
    const { totalPages, startIndex, paginatedVinyls } = useMemo(() => {
        const total = Math.ceil(filteredVinyls.length / itemsPerPage)
        const start = (currentPage - 1) * itemsPerPage
        const paginated = filteredVinyls.slice(start, start + itemsPerPage)
        return { totalPages: total, startIndex: start, paginatedVinyls: paginated }
    }, [filteredVinyls, currentPage, itemsPerPage])

    const SortIcon = ({ column }: { column: keyof Vinyl }) => {
        if (sortColumn !== column) return <ArrowUpDown className="w-4 h-4 ml-2 opacity-50" />
        return sortDirection === 'asc'
            ? <ArrowUp className="w-4 h-4 ml-2 text-primary" />
            : <ArrowDown className="w-4 h-4 ml-2 text-primary" />
    }

    const SortableHeader = ({ column, label, className = "" }: { column: keyof Vinyl, label: string, className?: string }) => (
        <th
            className={`p-4 cursor-pointer hover:bg-white/10 transition-colors select-none ${className}`}
            onClick={() => handleSort(column)}
        >
            <div className="flex items-center">
                {label}
                <SortIcon column={column} />
            </div>
        </th>
    )

    const addToCollectionFromWishlist = async (vinylId: string) => {
        try {
            await wishlistToCollection(vinylId)
            toast.success('Vinyl added to collection')
        } catch (error) {
            console.error('Error adding vinyl:', error)
            toast.error('Error adding vinyl to collection')
        }
    }
    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Filter by artist, title, or year..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            setCurrentPage(1)
                        }}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Genre</span>
                        <select
                            value={genreFilter}
                            onChange={(e) => {
                                setGenreFilter(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="bg-white/5 border border-white/10 rounded px-2 py-1 focus:border-primary outline-none"
                        >
                            <option value="all">All</option>
                            {genres.map(genre => (
                                <option key={genre} value={genre}>{genre}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Show</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value))
                                setCurrentPage(1)
                            }}
                            className="bg-white/5 border border-white/10 rounded px-2 py-1 focus:border-primary outline-none"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <span>per page</span>
                    </div>
                </div>
            </div>

            {filteredVinyls.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-muted-foreground text-lg">
                        {searchQuery
                            ? 'No records found matching your search.'
                            : 'No vinyls in your collection yet.'}
                    </p>
                </div>
            ) : (
                <>
                    <div className="w-full overflow-x-auto text-black">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-white/10 bg-white/5 text-muted-foreground font-medium">
                                <tr>
                                    <th className="p-4 w-20">Cover</th>
                                    <SortableHeader column="title" label="Title" />
                                    <SortableHeader column="artist" label="Artist" />
                                    <SortableHeader column="format" label="Format" />
                                    <SortableHeader column="year" label="Year" className="w-24" />
                                    {isLogin && <th
                                        className={`p-4 cursor-pointer hover:bg-white/10 transition-colors select-none`}
                                    >
                                        <div className="flex items-center">
                                            Action
                                        </div>
                                    </th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {paginatedVinyls.map((vinyl) => (
                                    <tr key={vinyl.id} >
                                        <td className="p-4">
                                            <div className="relative w-12 h-12 rounded overflow-hidden">
                                                {vinyl.cover_image ? (
                                                    <Image
                                                        src={vinyl.cover_image}
                                                        alt={vinyl.title}
                                                        fill
                                                        sizes="48px"
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                                        No Img
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 font-medium">
                                            <Link href={`/collection/album/${vinyl.id}`}>
                                                {vinyl.title}
                                            </Link>
                                        </td>
                                        <td className="p-4">{vinyl.artist}</td>
                                        <td className="p-4">{vinyl.format}</td>
                                        <td className="p-4">{vinyl.year || '-'}</td>
                                        {isLogin && <td className="mx-auto">
                                            <div
                                                onClick={() => addToCollectionFromWishlist(vinyl.id)}
                                                className="flex items-center gap-2 border w-fit border-black/50 rounded p-2 justify-center">
                                                <Plus className="w-5 h-5 flex-shrink-0" />
                                                <span className="hidden sm:inline">Collection</span>
                                            </div>
                                        </td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-white/10 pt-4">
                            <div className="text-sm text-muted-foreground">
                                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredVinyls.length)} of {filteredVinyls.length} results
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-muted-foreground">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
