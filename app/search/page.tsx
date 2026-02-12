'use client'
import { useEffect, useState } from 'react'
import { DiscogsRelease } from '@/lib/types/DiscogsRelease'
import { SearchBar } from '@/components/searchbar';
import { SearchFilters } from '@/components/searchFilters';
import { SearchResults } from '@/components/searchResults';
import { searchDiscogs } from '@/lib/discogs';

type SearchType = 'all' | 'album' | 'artist';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<DiscogsRelease[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [searchType, setSearchType] = useState<SearchType>('all');
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [yearRange, setYearRange] = useState<[number, number]>([1950, 2024]);

    const getSearchResults = async () => {
        const searchParams = new URLSearchParams({
            q: query,
            type: searchType,
            genre: selectedGenre,
        });
        const { results: searchResults } = await searchDiscogs(searchParams.toString(), 1, 'vinyl');
        console.log({ searchResults });
        setResults(
            searchResults.filter((album) => {
                const q = query.toLowerCase();

                if (
                    !album.title.toLowerCase().includes(q) &&
                    !album.artists[0].name.toLowerCase().includes(q)
                ) {
                    return false;
                }

                if (searchType === 'album' && !album.title.toLowerCase().includes(q)) return false;
                if (searchType === 'artist' && !album.artists[0].name.toLowerCase().includes(q)) return false;
                if (selectedGenre !== 'All' && album.genres[0] !== selectedGenre) return false;
                if (album.year < yearRange[0] || album.year > yearRange[1]) return false;

                return true;
            })
        );
    }

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        getSearchResults();
    }, [query, searchType, selectedGenre, yearRange]);

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
