'use client'
import VinylTable from "@/components/VinylTable"
import { redirect, useSearchParams } from "next/navigation"
import ShareModal from "@/components/ShareModal"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState, useMemo, useCallback, Suspense } from "react"
import { Vinyl } from "@/lib/types/tables"

function WishListContent() {
    const [vinyls, setVinyls] = useState<Vinyl[]>([])
    const [genres, setGenres] = useState<string[]>([])
    const [isLogin, setIsLogin] = useState(false)
    const [loading, setLoading] = useState(true)
    const query = useSearchParams()
    const token = query.get('token')

    // Memoize supabase client to prevent recreation on every render
    const supabase = useMemo(() => createClient(), [])


    const verifyAuth = useCallback(async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return redirect('/')
        }
        setIsLogin(true)
        const { data } = await supabase
            .from('vinyls')
            .select('*')
            .filter('owned', 'eq', false)
            .order('created_at', { ascending: false })
        setVinyls(data || [])
        const { data: DataGenres } = await supabase.from('genres').select('name')
        setGenres(DataGenres?.map((genre) => genre.name) || [])
        setLoading(false)
    }, [supabase])

    const verifyToken = useCallback(async () => {
        const res = await fetch(`/api/magicLink?token=${token}`)
        const { vinyls, error } = await res.json()

        if (error === 'Token expirado') {
            return redirect('/not-found')
        }
        setVinyls(vinyls || [])
        const { data: DataGenres } = await supabase.from('genres').select('name')
        setGenres(DataGenres?.map((genre) => genre.name) || [])
        setLoading(false)
    }, [token, supabase])

    useEffect(() => {
        // Only run once when component mounts
        if (loading) {
            if (!token) {
                verifyAuth()
            } else {
                verifyToken()
            }
        }
    }, []) // Empty dependency array - only run once

    return (
        <div className="container mx-auto px-6">
            <div className="flex items-center justify-between my-10">
                <h1 className="text-3xl font-bold">
                    Wish List
                </h1>
                <ShareModal />
            </div>
            <VinylTable vinyls={vinyls || []} isLogin={isLogin} genres={genres || []} />
        </div>
    )
}

export default function WishListPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <WishListContent />
        </Suspense>
    )
}