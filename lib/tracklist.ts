
export async function getTracks(masterId: string) {
    const results = await fetch(`https://api.discogs.com/masters/${masterId}`)
    return results.json()
}