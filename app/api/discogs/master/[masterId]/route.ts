import { getFetchDiscogs } from "@/utils/fetchDiscogs"
import { NextResponse } from "next/server"



export async function GET(request: Request, { params }: { params: Promise<{ masterId: string }> }) {
    const { masterId } = await params
    const releaseMaster = await getFetchDiscogs(`https://api.discogs.com/masters/${masterId}`)
    return NextResponse.json(releaseMaster)
}