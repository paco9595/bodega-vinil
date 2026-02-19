import { requireUser } from "@/app/api/_lib/auth";
import { getFetchDiscogs } from "@/utils/fetchDiscogs";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const { id: userId } = await requireUser(request);
    const { masterId: id, owned } = await request.json();
    if (!id) {
        return new Response(JSON.stringify({ error: 'Missing id', message: 'Missing id' }), { status: 400 })
    }
    const releaseMaster = await getFetchDiscogs(`https://api.discogs.com/masters/${id}`)
    console.log({ releaseMaster })
    const supabase = await createClient()
    const { data, error } = await supabase.from('vinyls').insert([
        {
            artist: releaseMaster.artists?.[0].name ?? 'Unknown Artist',
            cover_image: releaseMaster.images?.[0].uri ?? '',
            discogs_id: id,
            format: 'vinyl',
            owned: owned,
            release_data: releaseMaster,
            title: releaseMaster.title,
            user_id: userId,
            year: releaseMaster.year?.toString() ?? ''
        }
    ]).select()
    if (error) {
        return new Response(JSON.stringify({ error, message: 'Error al insertar el vinilo' }), { status: 500 })
    }
    return new Response(JSON.stringify(data), { status: 200 })
}