import CollectionStats from "@/components/CollectionStats";
import useServerUser from "@/hooks/useServerUser";

export default async function ProfilePage() {
    const { supabase, user } = await useServerUser()

    const { data: vinyls } = await supabase
        .from('vinyls')
        .select('*')
        .filter('owned', 'eq', true)
    console.log(user)
    return (
        <main className="container mx-auto px-6 py-8">
            <div className="flex items-center gap-2 mt-8 mb-12">
                <img src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name} className="w-24 h-24 rounded-full" />
                <div className="ml-4">
                    <p className="font-semibold text-2xl">{user?.user_metadata?.full_name}</p>
                    <p className="font-semibold text-2xl">{user?.user_metadata?.email}</p>
                </div>
            </div>
            <div className="flex flex-col gap-6 mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Collection Insights</h1>
                    <p className="text-muted-foreground">
                        Analyze your collecting habits, top artists, and estimated value.
                    </p>
                </div>
            </div>

            <CollectionStats vinyls={vinyls || []} />
        </main>
    )
}