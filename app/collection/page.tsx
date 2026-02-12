'use client'
import { useEffect, useState } from 'react';
import { ChevronDown, Grid3x3, List } from 'lucide-react';
import { AlbumCardDrawer, AlbumDrawer } from '@/components/card';
import { createClient } from '@/utils/supabase/client';
import { DiscogsRelease } from '@/lib/types/DiscogsRelease';
import { Vinyl } from '@/lib/types/tables';

type ViewMode = 'grid' | 'table';
type SortBy = 'title' | 'artist' | 'year';

export default function DashboardPage() {
    const supabase = createClient()
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [sortBy, setSortBy] = useState<SortBy>('title');
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [collection, setCollection] = useState<Vinyl[]>([])

    const getFetchCollection = async () => {
        const { data } = await supabase
            .from('vinyls')
            .select('*')
            .filter('owned', 'eq', true)
            .order('created_at', { ascending: false })

        if (data) {
            console.log({ data })
            setCollection(data)
        }
    }

    useEffect(() => {
        getFetchCollection()
    }, [])

    const sortedCollection = [...collection].sort((a, b) => {
        switch (sortBy) {
            case 'title':
                return a.title.localeCompare(b.title);
            case 'artist':
                return a.artist.localeCompare(b.artist);
            case 'year':
                return (Number(b.year) || 0) - (Number(a.year) || 0);
            default:
                return 0;
        }
    });
    // const { data: genres } = await supabase.from('genres').select('name')
    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-light mb-2">My Collection</h2>
                        <p className="text-zinc-400 text-sm">{[]?.length} albums</p>
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
                                {sortedCollection.map((album) => (
                                    <AlbumCardDrawer
                                        key={album.id}
                                        album={album.release_data as any}
                                    />
                                ))}
                            </div>
                        )}
                        {viewMode === 'table' && (
                            <div className="space-y-2">
                                {sortedCollection.map((album) => (
                                    <AlbumDrawer
                                        key={album.id}
                                        album={album as any}
                                    >
                                        <div className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-900 transition-colors text-left">
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
            </main>
        </div>
    )
}

interface SortOptionProps {
    label: string;
    active: boolean;
    onClick: () => void;
}

function SortOption({ label, active, onClick }: SortOptionProps) {
    return (
        <button
            onClick={onClick}
            className={`w-full px-4 py-3 text-left text-sm hover:bg-zinc-800 transition-colors ${active ? 'text-amber-500' : 'text-zinc-300'
                }`}
        >
            {label}
        </button>
    );
}
