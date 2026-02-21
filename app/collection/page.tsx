'use client'
import { useState } from 'react';
import { ChevronDown, Grid3x3, List } from 'lucide-react';
import { AlbumCardDrawer, AlbumDrawer } from '@/components/card';

import useCollection from '@/hooks/useGetCollection';
import { SortOption } from '@/components/sortOption';
import { Spinner } from '@/components/ui/spinner';

type ViewMode = 'grid' | 'table';

export default function DashboardPage() {
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [showSortMenu, setShowSortMenu] = useState(false);
    const { collection, isLoading, setSortBy, sortBy, error, filterBy, setFilterBy } = useCollection({ sort: 'title' })

    return (
        <div className="flex flex-1 bg-background">
            <main className="container mx-auto px-6 py-8">

                {!isLoading && !error &&
                    (<div className="flex flex-col max-w-7xl m-auto items-start md:items-center justify-between mb-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-light mb-2">My Collection</h2>
                            <p className="text-zinc-400 text-sm">{collection?.length} albums</p>
                        </div>
                        <div className='flex items-center justify-between mb-6 w-full'>
                            <input
                                type="text"
                                placeholder="Search albums..."
                                value={filterBy}
                                onChange={(e) => setFilterBy(e.target.value)}
                                className="w-full px-4 py-2 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-800"
                            />
                        </div>
                        <div className='flex flex-col justify-center items-center w-full'>
                            <div className="flex items-center justify-between mb-6 w-full">
                                {/* Sort Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowSortMenu(!showSortMenu)}
                                        className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-xl text-sm hover:bg-zinc-800 transition-colors"
                                    >
                                        <span className="text-zinc-400">Sort by:</span>
                                        <span className="capitalize">{sortBy}</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    {showSortMenu && (
                                        <div className="absolute top-full left-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl z-10 min-w-[160px]">
                                            <SortOption
                                                label="Album name"
                                                active={sortBy === 'title'}
                                                onClick={() => {
                                                    setSortBy('title');
                                                    setShowSortMenu(false);
                                                }}
                                            />
                                            <SortOption
                                                label="Artist"
                                                active={sortBy === 'artist'}
                                                onClick={() => {
                                                    setSortBy('artist');
                                                    setShowSortMenu(false);
                                                }}
                                            />
                                            <SortOption
                                                label="Year"
                                                active={sortBy === 'year'}
                                                onClick={() => {
                                                    setSortBy('year');
                                                    setShowSortMenu(false);
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* View Toggle */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                                            ? 'bg-amber-500 text-white'
                                            : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                                            }`}
                                    >
                                        <Grid3x3 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('table')}
                                        className={`p-2 rounded-lg transition-colors ${viewMode === 'table'
                                            ? 'bg-amber-500 text-white'
                                            : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                                            }`}
                                    >
                                        <List className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Grid View */}
                            {viewMode === 'grid' && (
                                <div className="grid grid-cols-2 gap-4">
                                    {collection.map((album) => (
                                        <AlbumCardDrawer
                                            key={album.id}
                                            album={album.release_data as any}
                                        />
                                    ))}
                                </div>
                            )}
                            {viewMode === 'table' && (
                                <div className="space-y-2 w-full">
                                    {collection.map((album) => (
                                        <AlbumDrawer
                                            key={album.id}
                                            album={album as any}
                                        >
                                            <div className="w-full flex items-center gap-4 py-3 rounded-xl hover:bg-zinc-900 transition-colors text-left">
                                                <img
                                                    src={album.cover_image || ''}
                                                    alt={album.title}
                                                    className="w-12 h-12 rounded-lg object-cover shadow-lg"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm line-clamp-1">{album.title}</p>
                                                    <p className="text-xs text-zinc-400">{album.artist}</p>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-zinc-500">
                                                    <span>{album.year}</span>
                                                    {/* <span className="text-xs">{album}</span> */}
                                                </div>
                                            </div>
                                        </AlbumDrawer>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    )}
                {
                    isLoading && (
                        <div className='w-full h-full flex-1 flex justify-center items-center'>
                            <Spinner />
                        </div>
                    )
                }
            </main>
        </div>
    )
}
