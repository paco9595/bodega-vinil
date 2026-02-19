import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function requireUser(req: Request) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_API_KEY!,
        {
            cookies: {
                getAll: () => cookieStore.getAll(),
                setAll: () => { }, // APIs no mutan cookies
            },
        }
    );

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        throw new Error('UNAUTHORIZED');
    }

    return user;
}
