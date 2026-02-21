
import { getFetchDiscogs } from "@/utils/fetchDiscogs"
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
export async function searchDiscogs(query: DiscogsSearchRequest): Promise<any> {
    return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/discogs/search?${new URLSearchParams(query as any).toString()}`).then(res => res.json())

}


export async function getRelease(id: number | string): Promise<DiscogsRelease | null> {
    try {
        const data = await getFetchDiscogs(
            `https://api.discogs.com/masters/${id}`,
            { next: { revalidate: 86400 } }
        )
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
