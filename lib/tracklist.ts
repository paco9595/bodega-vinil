
export async function getTracks(masterId: string) {
    const results = await fetch(`/api/discogs/master/${masterId}`)
    return results.json()
}

export async function getArtistReleases(artistId: string) {
    const results = await fetch(`/api/discogs/artist/${artistId}`)
    return results.json()
}