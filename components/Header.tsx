import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, Bookmark, LogOut as LogOutIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function Header() {
    const router = useRouter()
    const [userProfile, setUserProfile] = useState<{ name: string | null; avatar: string | null }>({
        name: null,
        avatar: null
    })

    useEffect(() => {
        const getUser = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                setUserProfile({
                    name: user.user_metadata.full_name || user.user_metadata.name || user.email?.split('@')[0] || 'User',
                    avatar: user.user_metadata.avatar_url || user.user_metadata.picture || null
                })
            }
        }
        getUser()
    }, [])

    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.refresh()
    }

    // Get initials for fallback
    const getInitials = (name: string | null) => {
        if (!name) return '??'
        const parts = name.split(' ')
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
        return name.slice(0, 2).toUpperCase()
    }

    return (
        <header className="border-b border-card-border bg-background/80 backdrop-blur-md sticky top-0 z-50 px-6">
            <div className="max-w-7xl mx-auto h-[72px] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-blue rounded-lg flex items-center justify-center shadow-lg shadow-primary-blue/20">
                        <Bookmark className="w-5 h-5 text-white fill-current" />
                    </div>
                    <div className="flex flex-col -space-y-1">
                        <span className="font-bold text-lg text-white tracking-tight">
                            LinkKeep
                        </span>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                                LIVE SYNCING
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 pr-4 border-r border-card-border">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-white leading-none">
                                {userProfile.name || 'Loading...'}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full border-2 border-primary-blue/30 overflow-hidden bg-card transition-transform hover:scale-105">
                            {userProfile.avatar ? (
                                <img
                                    src={userProfile.avatar}
                                    alt={userProfile.name || 'User'}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold text-xs">
                                    {getInitials(userProfile.name)}
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleSignOut}
                        className="p-2.5 rounded-xl border border-card-border bg-card/50 hover:bg-red-500/10 hover:border-red-500/20 text-text-muted hover:text-red-500 transition-all duration-200"
                        title="Sign out"
                    >
                        <LogOutIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header >
    )
}
