const KEY = process.env.DISCOGS_CONSUMER_KEY
const SECRET = process.env.DISCOGS_CONSUMER_SECRET

export async function getFetchDiscogs(url: string) {
    if (!url) {
        console.error('URL is required')
        return { results: [], pagination: { page: 1, pages: 1, per_page: 50, items: 0 } }
    }
    if (!KEY || !SECRET) {
        console.error('Discogs credentials missing. Set DISCOGS_TOKEN or DISCOGS_CONSUMER_KEY/SECRET')
        return { results: [], pagination: { page: 1, pages: 1, per_page: 50, items: 0 } }
    }
    return await fetch(
        url,
        {
            headers: {
                Authorization: `Discogs key=${KEY}, secret=${SECRET}`,
                'User-Agent': 'VinylCollectionApp/1.0 (contact: francisco@email.com)',
            },
            cache: 'no-store',
        }
    ).then(res => res.json())
}