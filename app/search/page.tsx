'use client'
import { useState, useMemo } from 'react'
import { SearchBar } from '@/components/searchbar';
import { SearchFilters } from '@/components/searchFilters';
import { SearchResults } from '@/components/searchResults';
import { useSearchDiscogs } from '@/hooks/useSearchDiscogs';
import { Spinner } from '@/components/ui/spinner';
import useCollection from '@/hooks/useGetCollection';
import useWishlist from '@/hooks/useWistList';

type SearchType = 'all' | 'album' | 'artist';

export default function SearchPage() {

    const [query, setQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [searchType, setSearchType] = useState<SearchType>('all');
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [yearRange, setYearRange] = useState<[number, number]>([1950, 2024]);
    const { collection } = useCollection({ sort: 'title' });
    const { wishlist } = useWishlist();

    const collectionIds = useMemo(() => new Set(collection.map((v) => v.discogs_id)), [collection]);
    const wishlistIds = useMemo(() => new Set(wishlist.map((v) => v.discogs_id)), [wishlist]);

    const { results, isLoading } = useSearchDiscogs({
        q: query,
        searchType,
        genre: selectedGenre === 'All' ? undefined : selectedGenre,
        per_page: 50,
        sortBy: 'artist',
        pagination: 1
    })

    return (
        <>
            <div className="px-4 py-6">
                <SearchBar
                    query={query}
                    onChange={setQuery}
                    showFilters={showFilters}
                    onToggleFilters={() => setShowFilters(!showFilters)}
                />

                {showFilters && (
                    <SearchFilters
                        genres={[]}
                        searchType={searchType}
                        onSearchTypeChange={setSearchType}
                        selectedGenre={selectedGenre}
                        onGenreChange={setSelectedGenre}
                        yearRange={yearRange}
                        onYearRangeChange={setYearRange}
                    />
                )}

                {!isLoading ? <SearchResults
                    query={query}
                    results={results}
                    collectionIds={collectionIds}
                    wishlistIds={wishlistIds}
                /> :
                    (<div className="flex flex-1  justify-center items-center h-full">
                        <Spinner />
                    </div>)}
            </div>
        </>
    );
}
