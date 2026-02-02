import { searchDiscogs } from "@/lib/discogs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const query = req.nextUrl.searchParams.get('query')
        const page = Number(req.nextUrl.searchParams.get('page')) || 1
        const format = (req.nextUrl.searchParams.get('format') as string) || 'vinyl'

        if (!query) {
            return NextResponse.json({ results: [], pagination: { page: 1, pages: 1, per_page: 50, items: 0 } })
        }

        return NextResponse.json(await searchDiscogs(`q=${query}`, page, format))
    } catch (error) {
        console.error('Error searching Discogs:', error)
        return NextResponse.json({ results: [], pagination: { page: 1, pages: 1, per_page: 50, items: 0 }, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
    }
}