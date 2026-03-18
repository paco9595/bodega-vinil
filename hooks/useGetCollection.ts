import { useSearchParams, redirect } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Vinyl } from '@/lib/types/tables';
import { NormalizeString, sortArray } from '@/utils/utilits';

type SortBy = 'title' | 'artist' | 'year';

export default function useCollection({ sort = 'title' }: { sort: SortBy }) {
    const [collection, setCollection] = useState<Vinyl[]>([])
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [sortBy, setSortBy] = useState<SortBy>(sort);
    const [filterBy, setFilterBy] = useState<string>('')
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const supabase = useMemo(() => createClient(), [])

    const verifyAuth = useCallback(async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return redirect('/')
        }
    }, [supabase])

    useEffect(() => {
        const init = async () => {
            try {
                if (!token) {
                    await verifyAuth()
                }
                await getData()
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        }
        init()
    }, [token, verifyAuth])


    const getData = async () => {
        try {
            setIsLoading(true)
            let data;
            if (token) {
                const res = await fetch(`/api/magicLink?token=${token}`).then(res => res.json())
                if (res.error === 'Token expirado') {
                    return redirect('/not-found')
                }
                if (res.error) throw Error(res.error)
                data = res.vinyls
            } else {
                const res = await fetch('/api/get/collection').then(res => res.json())
                if (res.error) throw Error(res.error)
                data = res.data
            }
            const sortedCollection = sortArray(data || [], sortBy)
            setCollection(sortedCollection)

        } catch (e: any) {
            console.error(e)
            setCollection([])
            setError(null)
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

    return { collection: sortedCollection, isLoading, error, setSortBy, sortBy, filterBy, setFilterBy, isShared: !!token }

}