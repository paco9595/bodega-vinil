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


export async function getRelease(id: number): Promise<DiscogsRelease | null> {
    const token = process.env.DISCOGS_TOKEN
    const key = process.env.DISCOGS_CONSUMER_KEY
    const secret = process.env.DISCOGS_CONSUMER_SECRET

    let authHeader = ''
    if (token) {
        authHeader = `Discogs token=${token}`
    } else if (key && secret) {
        authHeader = `Discogs key=${key}, secret=${secret}`
    }

    try {
        const res = await fetch(`https://api.discogs.com/masters/${id}`, {
            headers: {
                'User-Agent': 'VinylCollectionApp/1.0',
                'Authorization': authHeader
            },
        })

        if (!res.ok) {
            if (res.status === 404) return null
            throw new Error(`Failed to fetch release: ${res.status}`)
        }

        const data = await res.json()
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
