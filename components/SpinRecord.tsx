'use client'

import { useEffect, useState } from 'react'
import { Vinyl } from '@/lib/types/tables'
import { Disc, Shuffle, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface SpinRecordProps {
    vinyls: Vinyl[]
    trigger?: number
    onSpinStateChange?: (isSpinning: boolean) => void
}

export default function SpinRecord({ vinyls, trigger, onSpinStateChange }: SpinRecordProps) {
    const [selectedVinyl, setSelectedVinyl] = useState<Vinyl | null>(null)
    const [isSpinning, setIsSpinning] = useState(false)

    useEffect(() => {
        if (trigger && trigger > 0) {
            spinRecord()
        }
    }, [trigger])

    const spinRecord = () => {
        if (vinyls.length === 0) return

        setIsSpinning(true)
        onSpinStateChange?.(true)

        // Simulate spinning animation
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * vinyls.length)
            setSelectedVinyl(vinyls[randomIndex])
            setIsSpinning(false)
            onSpinStateChange?.(false)
        }, 1000)
    }

    const closeModal = () => {
        setSelectedVinyl(null)
    }

    return (
        <>
            {/* Modal */}
            {selectedVinyl && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
                    onClick={closeModal}
                >
                    <div
                        className="bg-linear-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl max-w-2xl w-full p-8 relative animate-in zoom-in duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-bold mb-2">🎵 Time to Spin!</h2>
                            <p className="text-muted-foreground">Here's your randomly selected record</p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <div className="relative w-64 h-64 shrink-0 rounded-xl overflow-hidden border-4 border-primary/50 shadow-2xl">
                                {selectedVinyl.cover_image ? (
                                    <Image
                                        src={selectedVinyl.cover_image}
                                        alt={selectedVinyl.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                                        <Disc className="w-24 h-24 opacity-20" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 space-y-4 text-center md:text-left">
                                <div>
                                    <h3 className="text-2xl font-bold mb-1">{selectedVinyl.title}</h3>
                                    <p className="text-xl text-primary">{selectedVinyl.artist}</p>
                                </div>

                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    {selectedVinyl.year && (
                                        <span className="px-3 py-1 bg-white/10 rounded-full text-sm">
                                            {selectedVinyl.year}
                                        </span>
                                    )}
                                    {selectedVinyl.format && (
                                        <span className="px-3 py-1 bg-white/10 rounded-full text-sm">
                                            {selectedVinyl.format}
                                        </span>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-4 justify-center md:justify-start">
                                    <button
                                        onClick={spinRecord}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                    >
                                        <Shuffle className="w-4 h-4" />
                                        Spin Again
                                    </button>
                                    <Link
                                        href={`/collection/album/${selectedVinyl.id}`}
                                        className="flex items-center gap-2 px-4 py-2 bg-primary text-black hover:bg-primary/90 rounded-lg transition-colors font-medium"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
