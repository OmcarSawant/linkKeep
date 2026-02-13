import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

    if (!supabaseUrl || !supabaseKey) {
        return supabaseResponse
    }

    try {
        const supabase = createServerClient(supabaseUrl, supabaseKey, {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        })

        // IMPORTANT: DO NOT REMOVE auth.getUser()
        // This refreshes the session if it's expired
        await supabase.auth.getUser()

        // Redirect logic
        const { data: { user } } = await supabase.auth.getUser()

        if (
            !user &&
            !request.nextUrl.pathname.startsWith('/login') &&
            !request.nextUrl.pathname.startsWith('/auth')
        ) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        if (user && request.nextUrl.pathname === '/login') {
            const url = request.nextUrl.clone()
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
        }

        return supabaseResponse
    } catch (e) {
        // If anything fails in the middleware, just return the original response
        // to prevent a hard 500 error.
        console.error('Middleware Error:', e)
        return supabaseResponse
    }
}
