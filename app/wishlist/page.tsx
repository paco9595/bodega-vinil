'use client'
import { redirect, useSearchParams } from "next/navigation"
import ShareModal from "@/components/ShareModal"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState, useMemo, useCallback, Suspense } from "react"
import { Vinyl } from "@/lib/types/tables"
import { Heart } from "lucide-react"
import { WishListcart } from "@/components/wishListCart"
import { toast } from "sonner"

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

    const addToCollection = async (albumId: string) => {
        await fetch('api/update/table', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ albumId }),
        }).then((res) => {

            toast.success('Album added to collection')
            setVinyls(vinyls.filter((album) => album.id !== albumId))
        })

    }

    return (
        <div className="container mx-auto px-6">
            <div className="flex items-center justify-between my-10">
                <div>
                    <h2 className="text-2xl font-light mb-2">Wishlist</h2>
                    <p className="text-zinc-400 text-sm">{vinyls.length} albums</p>
                </div>
                <ShareModal />
            </div>
            {vinyls.length > 0 ? (
                <div className="space-y-3">
                    {vinyls.map((album) => (
                        <WishListcart key={album.id} album={album as any} addHandler={addToCollection} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-8 h-8 text-zinc-600" />
                    </div>
                    <p className="text-zinc-500">Your wishlist is empty</p>
                    <p className="text-sm text-zinc-600 mt-1">Add albums you want to collect</p>
                </div>
            )}
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
