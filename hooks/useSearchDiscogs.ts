import { DiscogsRelease } from "@/lib/types/DiscogsRelease";
import { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";

export interface DiscogsSearchRequest {
    q: string,
    searchType: 'all' | 'album' | "artist" | 'track',
    genre?: string,
    per_page: number,
    pagination: number,
    sortBy?: 'artist' | "album title" | "year"
}

export function useSearchDiscogs(query: DiscogsSearchRequest) {
    const [results, setResults] = useState<DiscogsRelease[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [pagination, setPagination] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(query.pagination);
    const debouncedQuery = useDebounce(query.q, 500)


    const getResults = async () => {
        setLoading(true);
        setError(null);
        if (!query.q) return;
        try {
            const params = new URLSearchParams({
                q: query.q,
                per_page: query.per_page.toString(),
                page: currentPage.toString()
            });
            if (query.genre) params.append('genre', query.genre);
            if (query.searchType === 'artist') params.append('type', 'artist')
            if (query.searchType === 'track') params.append('track', query.q)

            const response = await fetch(`/api/discogs/search?${params.toString()}`, { method: 'GET' });
            const data = await response.json();
            if (query.sortBy) {
                data.results.sort((a: DiscogsRelease, b: DiscogsRelease) => {
                    if (query.sortBy === 'album title') return a.title.localeCompare(b.title);
                    if (query.sortBy === 'year') return a.year - b.year;
                    return 0;
                });
            }
            setResults(data.results);
            setPagination(data.pagination);
        } catch (error) {
            setError(error as Error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        console.log({ debouncedQuery, trim: debouncedQuery.trim() })
        if (debouncedQuery.trim()) {
            getResults()
        } else if (debouncedQuery === '') {
            setResults([])
        }
    }, [debouncedQuery])

    return { results, isLoading, error, pagination, currentPage, setCurrentPage };
}