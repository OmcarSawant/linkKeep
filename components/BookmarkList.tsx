'use client'

import { createClient } from '@/lib/supabase/client'
import { Bookmark } from '@/types/database.types'
import { Loader2, LayoutGrid, List, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import BookmarkCard from './BookmarkCard'

export default function BookmarkList() {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    useEffect(() => {
        const supabase = createClient()

        const fetchBookmarks = async () => {
            const { data } = await supabase
                .from('bookmarks')
                .select('*')
                .order('created_at', { ascending: false })

            if (data) setBookmarks(data)
            setLoading(false)
        }

        fetchBookmarks()

        const channel = supabase
            .channel('realtime_bookmarks')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks'
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setBookmarks((current) => [payload.new as Bookmark, ...current])
                    } else if (payload.eventType === 'DELETE') {
                        setBookmarks((current) =>
                            current.filter((bookmark) => bookmark.id !== payload.old.id)
                        )
                    } else if (payload.eventType === 'UPDATE') {
                        setBookmarks((current) =>
                            current.map((bookmark) =>
                                bookmark.id === payload.new.id ? (payload.new as Bookmark) : bookmark
                            )
                        )
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!confirm('Are you sure you want to delete this bookmark?')) return

        setDeletingId(id)
        const supabase = createClient()
        await supabase.from('bookmarks').delete().eq('id', id)
        setDeletingId(null)
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-text-muted">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary-blue" />
                <p className="font-medium">Curating your collection...</p>
            </div>
        )
    }

    if (bookmarks.length === 0) {
        return (
            <div className="text-center p-16 border-2 border-dashed border-card-border rounded-[32px] bg-card/20">
                <div className="w-16 h-16 rounded-2xl bg-primary-blue/10 text-primary-blue flex items-center justify-center mx-auto mb-6">
                    <Plus className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Your collection is empty</h3>
                <p className="text-text-muted max-w-xs mx-auto">
                    Start building your library by adding your favorite websites above.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-white">Your Collection</h2>
                    <p className="text-sm text-text-muted">
                        <span className="text-primary-blue font-bold">{bookmarks.length}</span> bookmarks saved in total
                    </p>
                </div>

                <div className="flex items-center gap-2 p-1 bg-card border border-card-border rounded-xl">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all border ${viewMode === 'grid' ? 'bg-primary-blue text-white border-white/20' : 'text-text-muted hover:text-white border-transparent hover:border-card-border'}`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-all border ${viewMode === 'list' ? 'bg-primary-blue text-white border-white/20' : 'text-text-muted hover:text-white border-transparent hover:border-card-border'}`}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className={viewMode === 'grid' ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "flex flex-col gap-4"}>
                {bookmarks.map((bookmark) => (
                    <BookmarkCard
                        key={bookmark.id}
                        bookmark={bookmark}
                        onDelete={handleDelete}
                        isDeleting={deletingId === bookmark.id}
                    />
                ))}
            </div>
        </div>
    )
}
