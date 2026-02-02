'use server'
import { searchDiscogs } from '@/lib/discogs'

import { TablesInsert } from '@/lib/types/database.types'
import { createClient } from '@/utils/supabase/server'

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

    return await searchDiscogs(`q=${query}`, page, format)
}



export async function addToCollection(vinyl: Omit<TablesInsert<'vinyls'>, 'user_id'>) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Not authenticated')
    }

    const { error } = await supabase.from('vinyls').insert({
        ...vinyl,
        user_id: user.id,
    })

    if (error) {
        console.error('Error adding vinyl:', error)
        throw new Error('Failed to add vinyl')
    }
}

export async function wishlistToCollection(vinylId: string) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Not authenticated')
    }

    const { error } = await supabase.from('vinyls').update({
        owned: true
    }).eq('id', vinylId).eq('user_id', user.id)
    if (error) {
        console.error('Error adding vinyl:', error)
        throw new Error('Failed to add vinyl')
    }
}