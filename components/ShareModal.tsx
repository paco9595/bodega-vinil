'use client'

import { useState } from 'react'
import { Share2, X, Copy, Check, Loader2 } from 'lucide-react'

export default function ShareModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [link, setLink] = useState('')
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const generateLink = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await fetch('/api/magicLink', { method: 'POST' })
            const data = await res.json()

            if (!res.ok) throw new Error(data.error || 'Failed to generate link')

            setLink(data.link)
        } catch (err) {
            console.error(err)
            setError('Failed to generate link. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(link)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy', err)
        }
    }

    const handleOpen = () => {
        setIsOpen(true)
        if (!link) {
            generateLink()
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={handleOpen}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
            >
                <Share2 className="w-4 h-4" />
                Share Wishlist
            </button>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-zinc-900/50 border border-white/10 rounded-xl p-6 shadow-2xl">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute right-4 top-4 text-muted-foreground hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold mb-4">Share Wishlist</h2>

                <p className="text-muted-foreground text-sm mb-6">
                    Generate a temporary link to share your wishlist with others.
                </p>

                {error ? (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm mb-4">
                        {error}
                    </div>
                ) : null}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                        <span className="text-sm text-muted-foreground">Generating link...</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-500/50 border border-black/10">
                            <input
                                type="text"
                                value={link}
                                readOnly
                                className="flex-1 bg-transparent border-none outline-none text-sm text-muted-foreground font-mono"
                            />
                            <button
                                onClick={copyToClipboard}
                                className="p-2 rounded hover:bg-white/10 transition-colors text-white"
                                title="Copy to clipboard"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>

                        <button
                            onClick={generateLink}
                            className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium"
                        >
                            Generate New Link
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
