'use client'

import { createClient } from '@/lib/supabase/client'
import { Loader2, PlusCircle, Link as LinkIcon, Type } from 'lucide-react'
import { useState } from 'react'

interface BookmarkFormProps {
    onSuccess?: () => void
}

export default function BookmarkForm({ onSuccess }: BookmarkFormProps) {
    const [url, setUrl] = useState('')
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            new URL(url)
        } catch {
            setError('Please enter a valid URL')
            setLoading(false)
            return
        }

        if (!title.trim()) {
            setError('Please enter a title')
            setLoading(false)
            return
        }

        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            setError('You must be logged in to add bookmarks')
            setLoading(false)
            return
        }

        const { error: insertError } = await supabase
            .from('bookmarks')
            .insert({
                title: title.trim(),
                url: url.trim(),
                user_id: user.id
            } as any)

        if (insertError) {
            setError(insertError.message)
        } else {
            setUrl('')
            setTitle('')
            if (onSuccess) onSuccess()
        }
        setLoading(false)
    }

    return (
        <div className="bg-card border border-card-border rounded-[24px] p-8 shadow-xl">
            <div className="space-y-1 mb-8">
                <h2 className="text-xl font-bold text-white">Add New Bookmark</h2>
                <p className="text-sm text-text-muted">Store links instantly to your cloud-synced collection.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row items-end gap-6">
                <div className="flex-1 w-full space-y-2">
                    <label htmlFor="url" className="block text-[10px] font-bold text-text-muted uppercase tracking-wider pl-1">
                        WEBSITE URL
                    </label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary-blue transition-colors">
                            <LinkIcon className="w-4 h-4" />
                        </div>
                        <input
                            id="url"
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://github.com/trending"
                            className="w-full bg-input-bg border border-input-border text-white placeholder-text-muted/30 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue/50 transition-all"
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="flex-1 w-full space-y-2">
                    <label htmlFor="title" className="block text-[10px] font-bold text-text-muted uppercase tracking-wider pl-1">
                        BOOKMARK TITLE
                    </label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary-blue transition-colors">
                            <Type className="w-4 h-4" />
                        </div>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="GitHub Trending Repositories"
                            className="w-full bg-input-bg border border-input-border text-white placeholder-text-muted/30 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue/50 transition-all"
                            disabled={loading}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full lg:w-auto px-8 py-3 bg-primary-blue hover:bg-primary-hover text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-blue/20 disabled:opacity-50 h-[50px] whitespace-nowrap border border-white/10"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <PlusCircle className="w-5 h-5" />
                            Save Bookmark
                        </>
                    )}
                </button>
            </form>

            {error && (
                <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                    {error}
                </div>
            )}
        </div>
    )
}
