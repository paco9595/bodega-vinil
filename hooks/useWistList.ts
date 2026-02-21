import { Vinyl } from "@/lib/types/tables";
import { createClient } from "@/utils/supabase/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { redirect, useSearchParams } from "next/navigation"
import { toast } from "sonner";

export default function useWishlist() {
    const [wishlist, setWishList] = useState<Vinyl[]>([])
    const [genres, setGenres] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const supabase = useMemo(() => createClient(), [])
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const verifyAuth = useCallback(async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return redirect('/')
        }
        const { data } = await supabase
            .from('vinyls')
            .select('*')
            .filter('owned', 'eq', false)
            .order('created_at', { ascending: false })
        setWishList(data || [])
        const { data: DataGenres } = await supabase.from('genres').select('name')
        setGenres(DataGenres?.map((genre) => genre.name) || [])
    }, [supabase])

    const verifyToken = useCallback(async () => {
        const res = await fetch(`/api/magicLink?token=${token}`)
        const { vinyls, error } = await res.json()

        if (error === 'Token expirado') {
            return redirect('/not-found')
        }
        setWishList(vinyls || [])
        const { data: DataGenres } = await supabase.from('genres').select('name')
        setGenres(DataGenres?.map((genre) => genre.name) || [])
    }, [token, supabase])

    useEffect(() => {
        const init = async () => {
            try {
                if (!token) {
                    await verifyAuth()
                } else {
                    await verifyToken()
                }
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        }

        init()
    }, [token, verifyToken, verifyAuth])

    const addToCollectionFormWishList = async (albumId: string) => {
        await fetch('api/update/table', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ albumId }),
        }).then((res) => {

            toast.success('Album added to collection')
            setWishList(wishlist.filter((album) => album.id !== albumId))
        })

    }
    const addToCollectionFromSearch = async (albumId: number, owned: boolean) => {
        await fetch('/api/insert/item', {
            method: 'POST',
            body: JSON.stringify({
                masterId: albumId,
                owned,
            })
        })
    }


    return { wishlist, isLoading, genres, addToCollectionFormWishList, addToCollectionFromSearch }
}