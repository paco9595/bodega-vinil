import { searchDiscogs } from "./discogs"

export async function getTopArtists() {
    const res = await fetch(`https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${process.env.LASTFM_API_KEY}&format=json`)
    const data = await res.json()
        .then((data: any) => data.artists.artist || [])
        .then((artists: any) => artists.map((artist: any) => ({
            ...artist,
            cover_image: artist.image[3]['#text'],
            id: artist.mbid,
            title: artist.name
        })))
    return data
}

const TOP_GENRES = ['Rock', 'Pop', 'Hip Hop', 'Electronic']


// export async function getTopTags() {
//     const res = await fetch(`https://ws.audioscrobbler.com/2.0/?method=chart.gettoptags&limit=20&api_key=${process.env.LASTFM_API_KEY}&format=json`)
//     const data = await res.json()
//         .then((data: any) => data.tags.tag || [])
//     const results = await Promise.all(
//         TOP_GENRES.map(async (tag: string) => ({
//             tag: tag,
//             results: await searchDiscogs(`genre=${tag}&per_page=20`).then((data: any) => data.results)
//         }))
//     )
//     return results
// }
