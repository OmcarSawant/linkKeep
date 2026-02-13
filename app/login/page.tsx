'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Bookmark, ShieldCheck, Globe, Zap } from 'lucide-react'

function LoginForm() {
    const [loading, setLoading] = useState(false)
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    const handleLogin = async () => {
        setLoading(true)
        const supabase = createClient()
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        })

        if (error) {
            console.error('Login Error:', error)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-blue/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-[440px] z-10">
                <div className="bg-card border border-card-border rounded-[24px] p-10 space-y-8 shadow-2xl">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-12 h-12 bg-primary-blue rounded-xl flex items-center justify-center shadow-lg shadow-primary-blue/20">
                            <Bookmark className="w-6 h-6 text-white fill-current" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight text-white">
                                SmartBookmark
                            </h1>
                            <p className="text-sm text-text-muted">
                                Your digital library, synced and smart.
                            </p>
                        </div>
                    </div>

                    <div className="text-center space-y-2 pt-2">
                        <h2 className="text-xl font-semibold text-white">Welcome Back</h2>
                        <p className="text-sm text-text-muted">
                            Sign in to access your curated collection.
                        </p>
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-primary-blue hover:bg-primary-hover text-white font-medium transition-all duration-200 shadow-lg shadow-primary-blue/20 disabled:opacity-50 border border-white/10"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#ffffff"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#ffffff"
                                            opacity="0.8"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#ffffff"
                                            opacity="0.8"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#ffffff"
                                            opacity="0.8"
                                        />
                                    </svg>
                                    Sign in with Google
                                </>
                            )}
                        </button>
                    </div>

                    <div className="flex items-center justify-center gap-8 pt-4">
                        <div className="flex items-center gap-2 grayscale opacity-40">
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Built With</span>
                            <Zap className="w-3 h-3 text-text-muted" />
                        </div>
                        <div className="w-[1px] h-3 bg-card-border" />
                        <div className="flex items-center gap-2 grayscale opacity-40">
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Powered By</span>
                            <Globe className="w-3 h-3 text-text-muted" />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col items-center space-y-4">
                    <div className="flex items-center gap-6 text-[11px] font-medium text-text-muted uppercase tracking-wider">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Help Center</a>
                    </div>
                    <p className="text-[10px] font-bold text-text-muted/40 uppercase tracking-[0.2em]">
                        © 2024 SMARTBOOKMARK
                    </p>
                </div>
            </div>

            {/* Preview of Dashboard mockup (aesthetic touch from Stitch) */}
            <div className="absolute bottom-[-100px] right-[-50px] w-[600px] h-[400px] bg-[#1a1a2e] border border-card-border rounded-tl-[40px] rotate-[-5deg] opacity-20 hidden lg:block shadow-3xl">
                <div className="p-8 space-y-6">
                    <div className="w-32 h-4 bg-card-border rounded-full" />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="aspect-video bg-card-border/50 rounded-xl" />
                        <div className="aspect-video bg-card-border/50 rounded-xl" />
                        <div className="aspect-video bg-card-border/50 rounded-xl" />
                        <div className="aspect-video bg-card-border/50 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="w-8 h-8 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div></div>}>
            <LoginForm />
        </Suspense>
    )
}
