import { createClient } from '@/utils/supabase/server'
import VinylTable from '@/components/VinylTable'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import GridCards from '@/components/gridCards';
import Link from 'next/link'
import SpinRecord from '@/components/SpinRecord'

export const metadata: Metadata = {
    title: "My Collection",
    description: "View and manage your personal vinyl record collection.",
};

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/')
    }

    const { data: vinyls } = await supabase
        .from('vinyls')
        .select('*')
        .filter('owned', 'eq', true)
        .order('created_at', { ascending: false })

    const { data: genres } = await supabase.from('genres').select('name')
    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-7xl font-bold">
                            My Collection
                        </h1>
                        <p className="text-base mt-4 text-muted-foreground text-stone-500/70 font-light">Curating the finest analog sound since 1977</p>
                    </div>
                    <div className="flex gap-3">
                        <SpinRecord vinyls={vinyls || []} />
                        <Link
                            href="/collection/insights"
                            className="px-6 py-3 bg-white/5 border border-white/10 rounded-full font-medium hover:bg-white/10 transition-colors"
                        >
                            View Insights
                        </Link>
                    </div>
                </div>

                {/* <VinylTable vinyls={vinyls || []} genres={genres?.map((genre) => genre.name) || []} /> */}
                <GridCards vinyls={vinyls || []} />
            </main>
        </div>
    )
}
