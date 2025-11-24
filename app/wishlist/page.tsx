import VinylTable from "@/components/VinylTable"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function WishListPage() {
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
        .filter('owned', 'eq', false)
        .order('created_at', { ascending: false })

    return (
        <div>
            <h1 className="text-3xl font-bold my-10">
                Wish List
            </h1>
            <VinylTable vinyls={vinyls || []} />
        </div>
    )
}