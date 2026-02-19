import { createClient } from "@/utils/supabase/server";
import { requireUser } from "../../_lib/auth";

export async function PUT(request: Request) {
    const { id: userId } = await requireUser(request);
    const { albumId } = await request.json();

    const supabase = await createClient()
    const { data, error } = await supabase.from('vinyls').update({
        owned: true,
    })
        .eq('id', albumId)
        .eq('user_id', userId)
        .select()
        .single()

    if (error) {
        console.error(error)
        return new Response(JSON.stringify({ albumId, userId, error, message: 'Error al actualizar el vinilo' }), { status: 500 })
    }

    return new Response(JSON.stringify(data), { status: 200 })
}