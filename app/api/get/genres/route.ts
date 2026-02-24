import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('genres')
        .select('name')

    if (error) {
        return NextResponse.json({ data: [], error: 'Error getting data' }, { status: 500 })
    }
    return NextResponse.json({ data: data || [], error: null }, { status: 200 })
}