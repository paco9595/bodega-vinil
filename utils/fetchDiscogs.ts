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

    let attempt = 0;
    let lastResText = "";

    while (attempt < 3) {
        try {
            const res = await fetch(url, fetchOptions);
            lastResText = await res.text();

            if (res.status === 429 || res.status === 502 || res.status === 503) {
                console.warn(`Discogs API ${res.status} on ${url}. Retrying in 3 seconds... (Attempt ${attempt + 1})`);
                await new Promise(resolve => setTimeout(resolve, 3000));
                attempt++;
                continue;
            }

            try {
                // If it's completely empty on 204 or something, return empty object
                if (!lastResText) return {};
                return JSON.parse(lastResText);
            } catch (e) {
                console.error(`Discogs JSON parse failed for ${url}. Status: ${res.status}. Body: ${lastResText.substring(0, 150)}`);
                return { message: "Invalid JSON response" };
            }
        } catch (error) {
            console.error(`Fetch request failed for ${url} on attempt ${attempt + 1}:`, error);
            await new Promise(resolve => setTimeout(resolve, 3000));
            attempt++;
        }
    }

    return { message: "API Failed after retries" };
}