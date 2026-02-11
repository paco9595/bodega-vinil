import { createClient } from "@/utils/supabase/server"
import { searchDiscogs } from "./discogs";
import { DiscogsSearchResponse } from "./types/DiscogsRelease";

export async function getRecomendations(): Promise<DiscogsSearchResponse> {
    try {

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { results: [], pagination: { page: 1, pages: 1, per_page: 50, items: 0 } }
        const { data } = await supabase
            .rpc("get_genre_seed_pool", {
                p_user_id: user.id,
            });
        if (!data) return { results: [], pagination: { page: 1, pages: 1, per_page: 50, items: 0 } }
        const { genre } = pickWeightedRandom(data)

        const results = await searchDiscogs(`genre=${genre}&per_page=20`)
        return results
    } catch (error) {
        console.error(error)
        return { results: [], pagination: { page: 1, pages: 1, per_page: 50, items: 0 } }
    }
}
function pickWeightedRandom(items: any[]) {
    const weighted = items.map(i => ({
        ...i,
        weight: i.total
    }));

    const total = weighted.reduce((s: number, i: any) => s + i.weight, 0);
    let r = Math.random() * total;

    for (const item of weighted) {
        if ((r -= item.weight) <= 0) return item;
    }
}

export async function getTopAlbums(): Promise<DiscogsSearchResponse> {
    const results = await searchDiscogs(new URLSearchParams({ genre: "Rock", style: "Pop Rock", year: '1980', format: 'Vinyl', per_page: '20' }).toString())
    return results
}