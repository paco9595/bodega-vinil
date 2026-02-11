import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import CollectionStats from '@/components/CollectionStats'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
    title: "Collection Insights",
    description: "Statistics and analytics for your vinyl collection.",
};

export default async function InsightsPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/')
    } else {
        console.log({ user })
    }
    // Fetch only owned vinyls for stats
    const { data: vinyls } = await supabase
        .from('vinyls')
        .select('*')
        .filter('owned', 'eq', true)

    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-6 py-8">
                <div className="flex flex-col gap-6 mb-8">
                    <Link
                        href="/collection"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Collection
                    </Link>

                    <div>
                        <h1 className="text-4xl font-bold mb-2">Collection Insights</h1>
                        <p className="text-muted-foreground">
                            Analyze your collecting habits, top artists, and estimated value.
                        </p>
                    </div>
                </div>

                <CollectionStats vinyls={vinyls || []} />
            </main>
        </div>
    )
}
