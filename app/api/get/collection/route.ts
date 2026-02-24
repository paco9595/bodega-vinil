import { NextResponse } from "next/server";
import { requireUser } from "../../_lib/auth";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
    const { id: userId } = await requireUser(request);
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('vinyls')
        .select('*')
        .eq('user_id', userId)
        .filter('owned', 'eq', true)
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ data: [], error: 'Error getting data' }, { status: 500 })
    }
    return NextResponse.json({ data: data || [], error: null }, { status: 200 })
}