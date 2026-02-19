'use client'
import { useState } from 'react'
import { SearchBar } from '@/components/searchbar';
import { SearchFilters } from '@/components/searchFilters';
import { SearchResults } from '@/components/searchResults';
import { useSearchDiscogs } from '@/hooks/useSearchDiscogs';

type SearchType = 'all' | 'album' | 'artist';

export default function SearchPage() {

    const [query, setQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [searchType, setSearchType] = useState<SearchType>('all');
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [yearRange, setYearRange] = useState<[number, number]>([1950, 2024]);

    const { results } = useSearchDiscogs({
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

                <SearchResults
                    query={query}
                    results={results}
                />
            </div>
        </>
    );
}
