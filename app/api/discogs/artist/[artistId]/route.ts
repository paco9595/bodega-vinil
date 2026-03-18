import { getFetchDiscogs } from '@/utils/fetchDiscogs'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: Promise<{ artistId: string }> }) {
    const { artistId } = await params;
    const { searchParams } = new URL(req.url)
    const page = searchParams.get('page') ?? '1'
    const per_page = searchParams.get('per_page') ?? '50'

    const queryParams = new URLSearchParams({
        page,
        per_page
    })

    const data = await getFetchDiscogs(`https://api.discogs.com/artists/${artistId}/releases?${queryParams.toString()}`)
    return NextResponse.json(data)
}
