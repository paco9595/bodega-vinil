import { DiscogsRelease, DiscogsSearchResponse } from "./types/DiscogsRelease"


export async function searchDiscogs(query: string, page: number = 1, format: string = 'vinyl'): Promise<DiscogsSearchResponse> {
    if (!query) return { results: [], pagination: { page: 1, pages: 1, per_page: 50, items: 0 } }

    // Support both Token (if user has it) or Key/Secret (which user provided)
    const token = process.env.DISCOGS_TOKEN
    const key = process.env.DISCOGS_CONSUMER_KEY
    const secret = process.env.DISCOGS_CONSUMER_SECRET

    let authHeader = ''
    if (token) {
        authHeader = `Discogs token=${token}`
    } else if (key && secret) {
        authHeader = `Discogs key=${key}, secret=${secret}`
    } else {
        console.error('Discogs credentials missing. Set DISCOGS_TOKEN or DISCOGS_CONSUMER_KEY/SECRET')
        return { results: [], pagination: { page: 1, pages: 1, per_page: 50, items: 0 } }
    }

    try {
        let url = `https://api.discogs.com/database/search?${query}&type=master&page=${page}`
        if (!query.includes('per_page')) {
            url += `&per_page=12`
        }
        if (format && format !== 'all') {
            url += `&format=${encodeURIComponent(format)}`
        }

        const res = await fetch(
            url,
            {
                headers: {
                    'User-Agent': 'VinylCollectionApp/1.0',
                    'Authorization': authHeader
                },
            }
        )

        if (!res.ok) {
            const errorText = await res.text()
            console.error(`Discogs API Error: ${res.status} ${res.statusText}`, errorText)
            throw new Error(`Failed to fetch from Discogs: ${res.status}`)
        }

        const data = await res.json()
        return {
            results: data.results || [],
            pagination: data.pagination || { page: 1, pages: 1, per_page: 12, items: 0 }
        }
    } catch (error) {
        console.error('Discogs search error:', error)
        return { results: [], pagination: { page: 1, pages: 1, per_page: 12, items: 0 } }
    }
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

        return await res.json()
    } catch (error) {
        console.error('Discogs release error:', error)
        return null
    }
}
