'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
            <div className="bg-red-500/10 p-6 rounded-full mb-8">
                <AlertTriangle className="w-16 h-16 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Something went wrong!</h2>
            <p className="text-muted-foreground max-w-md mb-8 text-lg">
                We apologize for the inconvenience. An unexpected error has occurred.
                {process.env.NODE_ENV === 'development' && (
                    <span className="block mt-4 text-sm font-mono bg-black/20 p-4 rounded text-left overflow-auto max-w-full">
                        {error.message}
                    </span>
                )}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
                <button
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-semibold rounded-full hover:bg-primary/90 transition-all active:scale-95"
                >
                    <RefreshCcw className="w-5 h-5" />
                    Try again
                </button>
                <Link
                    href="/"
                    className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all active:scale-95 border border-white/10"
                >
                    <Home className="w-5 h-5" />
                    Go Home
                </Link>
            </div>
        </div>
    )
}
