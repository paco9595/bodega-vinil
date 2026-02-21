const KEY = process.env.DISCOGS_CONSUMER_KEY
const SECRET = process.env.DISCOGS_CONSUMER_SECRET

export async function getFetchDiscogs(url: string, options?: RequestInit) {
    if (!url) {
        console.error('URL is required')
        return { results: [], pagination: { page: 1, pages: 1, per_page: 50, items: 0 } }
    }
    if (!KEY || !SECRET) {
        console.error('Discogs credentials missing. Set DISCOGS_TOKEN or DISCOGS_CONSUMER_KEY/SECRET')
        return { results: [], pagination: { page: 1, pages: 1, per_page: 50, items: 0 } }
    }

    const fetchOptions: RequestInit = {
        ...options,
        headers: {
            ...options?.headers,
            Authorization: `Discogs key=${KEY}, secret=${SECRET}`,
            'User-Agent': 'VinylCollectionApp/1.0 (contact: francisco@email.com)',
        },
    }

    // Default to no-store only if no cache strategy is provided
    if (!fetchOptions.cache && !fetchOptions.next) {
        fetchOptions.cache = 'no-store'
    }

    return await fetch(url, fetchOptions).then(res => res.json())
}