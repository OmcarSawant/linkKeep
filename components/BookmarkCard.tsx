'use client'

import { Bookmark } from '@/types/database.types'
import { ExternalLink, Trash2, Clock, Link as LinkIcon } from 'lucide-react'
import { useState } from 'react'

interface BookmarkCardProps {
    bookmark: Bookmark
    onDelete: (id: string, e: React.MouseEvent) => void
    isDeleting: boolean
}

export default function BookmarkCard({ bookmark, onDelete, isDeleting }: BookmarkCardProps) {
    // Determine a theme color based on the domain (mock logic for the design match)
    const getThemeColor = (url: string) => {
        if (url.includes('github') || url.includes('dev')) return 'bg-blue-500'
        if (url.includes('supabase') || url.includes('db')) return 'bg-pink-500'
        if (url.includes('dribbble') || url.includes('design')) return 'bg-orange-400'
        return 'bg-emerald-400'
    }

    const getTag = (url: string) => {
        if (url.includes('github') || url.includes('dev')) return 'DEV TOOLS'
        if (url.includes('supabase') || url.includes('db')) return 'DATABASE'
        if (url.includes('dribbble') || url.includes('design')) return 'INSPIRATION'
        return 'LIBRARY'
    }

    const domain = new URL(bookmark.url).hostname.replace('www.', '')
    const themeColor = getThemeColor(bookmark.url)
    const tag = getTag(bookmark.url)

    return (
        <a href={bookmark.url}>
            <div className="group bg-card border border-card-border rounded-[20px] overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary-blue/10 hover:-translate-y-1">
                {/* Thumbnail Area */}
                <div className={`h-32 ${themeColor} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:scale-110 transition-transform duration-500">
                        <LinkIcon className="w-16 h-16 text-white" />
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-md bg-black/40 text-[10px] font-bold text-primary-blue border border-primary-blue/20 tracking-wider">
                            {tag}
                        </span>

                        <div className="flex items-center gap-1 opacity-100 transition-opacity">
                            <button
                                onClick={(e) => onDelete(bookmark.id, e)}
                                disabled={isDeleting}
                                className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <h3 className="font-bold text-white text-lg leading-tight group-hover:text-primary-blue transition-colors truncate">
                            {bookmark.title}
                        </h3>
                        <LinkIcon className="w-3.5 h-3.5" />
                        {domain}
                    </div>

                    <div className="pt-2 flex items-center gap-2 text-[11px] font-medium text-text-muted">
                        <Clock className="w-3.5 h-3.5" />
                        Added {new Date(bookmark.created_at).toLocaleDateString(undefined, {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </div>
                </div>
            </div>
        </a>
    )
}
