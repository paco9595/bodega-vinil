'use server'
import { searchDiscogs } from '@/lib/discogs'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function searchVinyls(formData: FormData) {
    const query = formData.get('query') as string
    const page = Number(formData.get('page')) || 1
    const format = (formData.get('format') as string) || 'vinyl'

    if (!query) {
        return {
            results: [],
            pagination: { page: 1, pages: 1, per_page: 50, items: 0 }
        }
    }

    return await searchDiscogs(query, page, format)
}

export async function addToCollection(vinyl: {
    title: string
    artist: string
    year: string
    cover_image: string
    discogs_id: number
    owned: boolean
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Not authenticated')
    }

    const { error } = await supabase.from('vinyls').insert({
        user_id: user.id,
        ...vinyl,
    })

    if (error) {
        console.error('Error adding vinyl:', error)
        throw new Error('Failed to add vinyl')
    }

    // revalidatePath('/dashboard')
    // redirect('/dashboard')
}
