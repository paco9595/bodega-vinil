import { randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    const { page = 'wishlist' } = await req.json();

    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    try {
        const { data: link, error: linkError } = await supabase
            .from("shared_links")
            .select("*")
            .eq("user_id", user.id)
            .eq("page", page)
            .single()

        if (!link) {
            const { data: tokenData, error } = await supabase.from('shared_links').insert({ token, page, expires, user_id: user.id });

            return NextResponse.json({ token, link: `${process.env.NEXT_PUBLIC_BASE_URL}/${page}?token=${token}` });
        } else {
            await supabase.from('shared_links').update({ expires }).eq('id', link.id);
            return NextResponse.json({ token, link: `${process.env.NEXT_PUBLIC_BASE_URL}/${page}?token=${link.token}` });
        }

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Error al generar el enlace' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient(true)
        const token = req.nextUrl.searchParams.get('token')
        const { data: link, error: linkError } = await supabase
            .from("shared_links")
            .select("*")
            .eq("token", token || '')
            .single();

        if (linkError || !link) {
            return NextResponse.json({ error: "Token inválido" }, { status: 401 });
        }

        if (new Date(link.expires) < new Date()) {
            return NextResponse.json({ error: "Token expirado" }, { status: 401 });
        }

        // Si page es wishlist owned = false, si es collection owned = true
        const isOwned = link.page === 'collection';

        const { data: vinyls, error: vinylError } = await supabase
            .from("vinyls")
            .select("*")
            .eq("user_id", link.user_id)
            .eq("owned", isOwned)
            .order("created_at", { ascending: false });

        if (vinylError) {
            return NextResponse.json({ error: vinylError.message }, { status: 500 });
        }

        return NextResponse.json({ vinyls, error: null })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Error al generar el enlace' }, { status: 500 });
    }
}