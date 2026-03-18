
export async function getTracks(masterId: string) {
    const results = await fetch(`/api/discogs/master/${masterId}`)
    return results.json()
}