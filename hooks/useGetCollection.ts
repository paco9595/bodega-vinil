import { createClient } from '@/utils/supabase/client';
import { useEffect, useMemo, useState } from 'react';
import { Vinyl } from '@/lib/types/tables';
import { NormalizeString, sortArray } from '@/utils/utilits';

type SortBy = 'title' | 'artist' | 'year';

export default function useCollection({ sort = 'title' }: { sort: SortBy }) {
    const [collection, setCollection] = useState<Vinyl[]>([])
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [sortBy, setSortBy] = useState<SortBy>(sort);
    const [filterBy, setFilterBy] = useState<string>('')

    useEffect(() => {
        getData()
    }, [])


    const getData = async () => {
        try {
            setIsLoading(true)
            const { data, error } = await fetch('/api/get/collection').then(res => res.json())
            if (error) throw Error(error)
            const sortedCollection = sortArray(data || [], sortBy)
            setCollection(sortedCollection)

        } catch (e: any) {
            console.error(e)
            setCollection([])
            setError(null)
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
        return sortArray(filteredCollection, sortBy)
    }, [collection, sortBy, filteredCollection])

    return { collection: sortedCollection, isLoading, error, setSortBy, sortBy, filterBy, setFilterBy }

}