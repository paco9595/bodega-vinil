
import { getFetchDiscogs } from '@/utils/fetchDiscogs'
import { NextResponse } from 'next/server'


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    console.log(searchParams)
    const q = searchParams.get('q')
    const page = searchParams.get('page') ?? '1'
    const per_page = searchParams.get('per_page') ?? '50'
    const type = searchParams.get('type') ?? 'master'
    const track = searchParams.get('track')
    const genre = searchParams.get('genre')
    const year = searchParams.get('year')

    if (!q && !track) {
        return NextResponse.json({ results: [], pagination: { page: 1, pages: 1, per_page: 50, items: 0 } }, { status: 400 })
    }
    const params = new URLSearchParams({
        page,
        per_page,
        format: 'vinyl'
    })
    console.log({ ...params, track })
    if (year) params.append('year', year)
    if (genre) params.append('genre', genre)
    if (!track && q) {
        params.set('q', q)
        params.set('type', type)

        if (type === 'artist') params.delete('format')

        console.log(params)
    } else if (track) {
        params.set('track', track)
    }
    // TODO: filtros avanzados agregar nombre del artista a la buquesa del album
    // if (artist) params.set('artist', artist)
    console.log({ params })

    const data = await getFetchDiscogs(`https://api.discogs.com/database/search?${params.toString()}`)
    console.log(data)
    return NextResponse.json(data)
}
