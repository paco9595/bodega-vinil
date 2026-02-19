import { createClient } from '@/utils/supabase/client';
import { DiscogsRelease } from '@/lib/types/DiscogsRelease';
import { useEffect, useState } from 'react';
import { Vinyl } from '@/lib/types/tables';

type SortBy = 'title' | 'artist' | 'year';

export default function useGetCollection({ sort = 'title' }: { sort: SortBy }) {
    const [collection, setCollection] = useState<Vinyl[]>([])
    const [erorr, setError] = useState({})
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [sortBy, setSortBy] = useState<SortBy>(sort);
    const supabase = createClient()


    useEffect(() => {
        getData()
    }, [sortBy])


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

    return { collection, isLoading, erorr, setSortBy, sortBy }

}