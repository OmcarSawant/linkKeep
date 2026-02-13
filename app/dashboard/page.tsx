'use client'

import BookmarkForm from '@/components/BookmarkForm'
import BookmarkList from '@/components/BookmarkList'
import Header from '@/components/Header'
import { useState } from 'react'
import { Zap } from 'lucide-react'

export default function DashboardPage() {
    const [refreshKey, setRefreshKey] = useState(0)

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 space-y-16">
                <BookmarkForm onSuccess={() => setRefreshKey(prev => prev + 1)} />

                <div className="pt-4">
                    <BookmarkList key={refreshKey} />
                </div>
            </main>

            <footer className="border-t border-card-border bg-card/30 py-8 px-6 mt-20">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-sm font-bold text-text-muted/50 uppercase tracking-widest">
                        © 2026 LinkKeep
                    </div>

                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-blue/10 border border-primary-blue/20">
                        <Zap className="w-3.5 h-3.5 text-primary-blue animate-pulse" />
                        <span className="text-[10px] font-bold text-primary-blue uppercase tracking-widest">
                            Real-time updates via Supabase
                        </span>
                    </div>

                    <div className="flex items-center gap-8 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                    </div>
                </div>
            </footer>
        </div>
    )
}
