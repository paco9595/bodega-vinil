'use server'
import { DiscogsRelease } from "./types/DiscogsRelease"
import { DiscogsReleaseSchema } from "./validations/discogs"


export interface DiscogsSearchRequest {
    q?: string,
    searchType: 'all' | 'album' | "artist",
    genre: string | null,
    year?: number,
    style?: string,
    format?: string,
    per_page: number
}
export async function searchDiscogs(query: DiscogsSearchRequest, page: number = 1): Promise<any> {
    if (!query.q) return { results: [], pagination: { page: 1, pages: 1, per_page: 50, items: 0 } }
    return await fetch(`/api/discogs/search?${new URLSearchParams(query as any).toString()}`)

}


export async function getRelease(id: number | string): Promise<DiscogsRelease | null> {
    try {
        const data = await fetch(`/api/discogs/master/${id}`)
        const validated = DiscogsReleaseSchema.safeParse(data)

        if (!validated.success) {
            console.error('Discogs API Validation Error (Release):', validated.error)
            return null
        }

        return validated.data as any // Cast because Zod inference might be slightly stricter or loose compared to original interface
    } catch (error) {
        console.error('Discogs release error:', error)
        return null
    }
}
