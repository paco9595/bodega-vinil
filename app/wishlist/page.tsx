'use client'
import VinylTable from "@/components/VinylTable"
import { redirect, useSearchParams } from "next/navigation"
import ShareModal from "@/components/ShareModal"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState, useMemo, useCallback, Suspense } from "react"
import { Vinyl } from "@/lib/types/tables"
import { DiscogsRelease } from "@/lib/validations/discogs"
import { ArrowRight, Heart } from "lucide-react"

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
                <div>
                    <h2 className="text-2xl font-light mb-2">Wishlist</h2>
                    <p className="text-zinc-400 text-sm">{vinyls.length} albums</p>
                </div>
                <ShareModal />
            </div>
            {vinyls.length > 0 ? (
                <div className="space-y-3">
                    {vinyls.map((album) => (
                        <WishListcart key={album.id} album={album as any} addHandler={() => { }} />
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
function WishListcart({ album, addHandler }: { album: DiscogsRelease & Partial<Vinyl>, addHandler: (albumId: number) => void }) {
    const imageUrl = Array.isArray(album.images) ? album.images[0].uri : (album.cover_image ?? album.thumb);
    return (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-800/50 hover:bg-zinc-900 transition-colors mb-8">
            <button className="flex items-center gap-4 flex-1 min-w-0">
                <img
                    src={imageUrl}
                    alt={album.title}
                    className="w-20 h-20 rounded-xl object-cover shadow-lg"
                />
                <div className="flex-1 min-w-0 text-left">
                    <p className="font-medium line-clamp-1">{album.title}</p>
                    <p className="text-sm text-zinc-400 mt-0.5">{album.artist}</p>
                    <p className="text-xs text-zinc-500 mt-1">
                        {album.year} •
                    </p>
                </div>
            </button>
            <button
                onClick={() => addHandler(album.id)}
                className="shrink-0 flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium transition-colors"
            >
                <span>Add</span>
                <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    )
}