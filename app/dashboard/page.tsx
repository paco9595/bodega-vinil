import { createClient } from '@/utils/supabase/server'
import VinylTable from '@/components/VinylTable'
import { redirect } from 'next/navigation'

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

    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">
                        My Collection
                    </h1>
                    <div className="text-sm text-muted-foreground">
                        {vinyls?.length || 0} Records
                    </div>
                </div>

                <VinylTable vinyls={vinyls || []} />
            </main>
        </div>
    )
}
