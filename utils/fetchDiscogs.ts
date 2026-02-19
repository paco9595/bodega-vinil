const TOKEN = process.env.NEXT_PUBLIC_DISCOGS_TOKEN
const KEY = process.env.NEXT_PUBLIC_DISCOGS_CONSUMER_KEY
const SECRET = process.env.NEXT_PUBLIC_DISCOGS_CONSUMER_SECRET

export async function getFetchDiscogs(url: string) {
    let authHeader = ''
    if (TOKEN) {
        authHeader = `Discogs token=${TOKEN}`
    } else if (KEY && SECRET) {
        authHeader = `Discogs key=${KEY}, secret=${SECRET}`
    } else {
        console.error('Discogs credentials missing. Set DISCOGS_TOKEN or DISCOGS_CONSUMER_KEY/SECRET')
        return { results: [], pagination: { page: 1, pages: 1, per_page: 50, items: 0 } }
    }
    return await fetch(
        url,
        {
            headers: {
                Authorization: authHeader,
                'User-Agent': 'VinylCollectionApp/1.0 (contact: francisco@email.com)',
            },
            cache: 'no-store',
        }
    ).then(res => res.json())
}