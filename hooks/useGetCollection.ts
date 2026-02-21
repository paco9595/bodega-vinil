import { createClient } from '@/utils/supabase/client';
import { useEffect, useMemo, useState } from 'react';
import { Vinyl } from '@/lib/types/tables';
import { NormalizeString } from '@/utils/utilits';

type SortBy = 'title' | 'artist' | 'year';

export default function useCollection({ sort = 'title' }: { sort: SortBy }) {
    const [collection, setCollection] = useState<Vinyl[]>([])
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [sortBy, setSortBy] = useState<SortBy>(sort);
    const [filterBy, setFilterBy] = useState<string>('')
    const supabase = createClient()


    useEffect(() => {
        getData()
    }, [])


    const getData = async () => {
        try {
            setIsLoading(true)
            const { data } = await supabase
                .from('vinyls')
                .select('*')
                .filter('owned', 'eq', true)
                .order('created_at', { ascending: false })

            if (!data) throw Error('error getting data')

            const sortedCollection = [...data].sort((a, b) => {
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
            setCollection(sortedCollection)

        } catch (e: any) {
            setError(e)
        }
        finally {
            setIsLoading(false)
        }
    }
    const filteredCollection = useMemo(() => {
        if (!filterBy) return collection
        const normalizedFilter = NormalizeString(filterBy)
        return collection.filter(album =>
            NormalizeString(album.title).includes(normalizedFilter) ||
            NormalizeString(album.artist).includes(normalizedFilter) ||
            NormalizeString(album.year || '').includes(normalizedFilter)
        )
    }, [collection, filterBy])

    const sortedCollection = useMemo(() => {
        if (!sortBy) return filteredCollection
        return [...filteredCollection].sort((a, b) => {
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
        })
    }, [collection, sortBy, filteredCollection])
    return { collection: sortedCollection, isLoading, error, setSortBy, sortBy, filterBy, setFilterBy }

}