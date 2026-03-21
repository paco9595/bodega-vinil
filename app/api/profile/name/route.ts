import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function POST(req: NextRequest) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const { name } = await req.json()
    const trimmedName = (name || "").trim()

    if (!trimmedName || trimmedName.length < 2) {
        return NextResponse.json({ error: "Nombre inválido" }, { status: 400 })
    }

    const { error } = await supabase.auth.updateUser({
        data: {
            ...user.user_metadata,
            full_name: trimmedName,
            name: trimmedName,
        },
    })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
}
