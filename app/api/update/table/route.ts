import { getRelease } from "@/lib/discogs";
import { DiscogsRelease } from "@/lib/types/DiscogsRelease";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//     const supabase = await createClient(true)
//     const { data: vinyls, error } = await supabase.from('vinyls').select('*')
//     if (error) {
//         return NextResponse.json({ error: error.message }, { status: 500 })
//     }

//     // Sets para acumular géneros y estilos únicos
//     const genresSet = new Set<string>()
//     const stylesSet = new Set<string>()

//     await Promise.all(
//         vinyls.map(async ({ discogs_id }) => {
//             await new Promise(res => setTimeout(res, 1000)); // evitar 429

//             const release = await getRelease(discogs_id || 0)

//             // Agregar géneros al Set (automáticamente elimina duplicados)
//             const genres = release?.genres ?? ([] as string[])
//             genres.forEach(genre => genresSet.add(genre))

//             // Agregar estilos al Set (automáticamente elimina duplicados)
//             const styles = release?.styles ?? ([] as string[])
//             styles.forEach(style => stylesSet.add(style))
//         })
//     )

//     const genres: { name: string }[] = Array.from(genresSet).map(genre => ({ name: genre }))
//     const styles: { name: string }[] = Array.from(stylesSet).map(style => ({ name: style }))

//     await supabase.from('genres').insert(genres)
//     await supabase.from('styles').insert(styles)


//     // Convertir Sets a arrays para la respuesta
//     return NextResponse.json({
//         genres: Array.from(genresSet),
//         styles: Array.from(stylesSet)
//     })

// }
// export async function GET(req: Request) {
//     const supabase = await createClient(true)
//     const { data: vinyls, error } = await supabase.from('vinyls').select('*')
//     if (error) {
//         return NextResponse.json({ error: error.message }, { status: 500 })
//     }

//     vinyls.forEach(async (vinyl) => {
//         await new Promise(res => setTimeout(res, 1000)); // evitar 429
//         const release = await getRelease(vinyl.discogs_id || 0)
//         const { data: genres } = await supabase
//             .from("genres")
//             .select("id, name")
//             .in("name", release?.genres || [])
//         const { data: styles } = await supabase
//             .from("styles")
//             .select("id, name")
//             .in("name", release?.styles || [])

//         await supabase.from('vinyl_genres').insert(genres?.map(genre => ({ vinyl_id: vinyl.id, genre_id: genre.id })) || [])
//         await supabase.from('vinyl_styles').insert(styles?.map(style => ({ vinyl_id: vinyl.id, style_id: style.id })) || [])
//     })
//     return NextResponse.json({ message: 'OK' })
// }



export async function GET() {
    const supabase = await createClient(true);
    const { data: vinyl, error } = await supabase.from('vinyls').select('*')

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    const arr: DiscogsRelease[] = [];
    await Promise.all(
        vinyl.map(async ({ discogs_id }) => {
            await new Promise(res => setTimeout(res, 1000));
            const release = await getRelease(discogs_id || 0)

            await supabase.from('vinyls').update({ release_data: release || {} as DiscogsRelease }).eq('discogs_id', discogs_id || 0)

            arr.push(release || {} as DiscogsRelease)

        })
    )
    return NextResponse.json({ results: arr, vinyl })

}