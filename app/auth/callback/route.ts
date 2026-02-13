import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const cookieStore = await cookies()
        const supabase = await createClient()

        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            return NextResponse.redirect(`${origin}${next}`)
        } else {
            console.error('Auth Callback Error: Code exchange failed', error)
        }
    } else {
        console.error('Auth Callback Error: No code provided')
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`)
}
