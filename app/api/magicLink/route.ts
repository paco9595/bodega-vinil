import { randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    try {
        const { data: link, error: linkError } = await supabase
            .from("shared_links")
            .select("*")
            .eq("user_id", user.id)
            .single()

        if (!link || link.length === 0) {
            const { data: tokenData, error } = await supabase.from('shared_links').insert({ token, page: 'wishlist', expires, user_id: user.id });

            return NextResponse.json({ token, link: `${process.env.NEXT_PUBLIC_BASE_URL}/wishlist?token=${token}` });
        } else {
            await supabase.from('shared_links').update({ expires }).eq('id', link.id);
            return NextResponse.json({ token, link: `${process.env.NEXT_PUBLIC_BASE_URL}/wishlist?token=${token}` });
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
            .eq("token", token)
            .single();

        if (linkError || !link) {
            return NextResponse.json({ error: "Token inválido o expirado" }, { status: 401 });
        }
        const { data: vinyls, error: vinylError } = await supabase
            .from("vinyls")
            .select("*")
            .eq("user_id", link.user_id)
            .eq("owned", false)
            .order("created_at", { ascending: false });

        if (vinylError) {
            return NextResponse.json({ error: vinylError.message }, { status: 500 });
        }

        return NextResponse.json(vinyls)
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Error al generar el enlace' }, { status: 500 });
    }
}