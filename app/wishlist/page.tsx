'use client'
import VinylTable from "@/components/VinylTable"
import { redirect, useSearchParams } from "next/navigation"
import ShareModal from "@/components/ShareModal"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState, Suspense } from "react"
import { Vinyl } from "@/lib/types/vinil"

function WishListContent() {
    const [vinyls, setVinyls] = useState<Vinyl[]>([])
    const query = useSearchParams()
    const token = query.get('token')
    console.log(token)
    const supabase = createClient()

    useEffect(() => {
        const verifytAuth = async () => {
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
            setVinyls(data || [])
        }

        const verifytToken = async () => {
            // hacer llamda get al magicLink con el token
            const res = await fetch(`/api/magicLink?token=${token}`)
            const { vinyls, error } = await res.json()


            if (error === 'Token expirado') {
                return redirect('/not-found')
            }
            console.log(vinyls)
            setVinyls(vinyls || [])
        }

        if (!token) {
            verifytAuth()
        } else {
            verifytToken()
        }
    }, [token])

    return (
        <div>
            <div className="flex items-center justify-between my-10">
                <h1 className="text-3xl font-bold">
                    Wish List
                </h1>
                <ShareModal />
            </div>
            <VinylTable vinyls={vinyls || []} />
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