'use client'

import Image from 'next/image'
import Link from 'next/link'

interface Vinyl {
    id: string
    title: string
    artist: string
    year: string | null
    cover_image: string | null
    discogs_id: number | null
}

export default function VinylTable({ vinyls }: { vinyls: Vinyl[] }) {
    if (vinyls.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">No vinyls in your collection yet.</p>
            </div>
        )
    }

    return (
        <div className="w-full overflow-x-auto text-black">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-white/10 bg-white/5 text-muted-foreground font-medium">
                    <tr>
                        <th className="p-4 w-20">Cover</th>
                        <th className="p-4">Title</th>
                        <th className="p-4">Artist</th>
                        <th className="p-4 w-24">Year</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {vinyls.map((vinyl) => (
                        <tr key={vinyl.id} >
                            <td className="p-4">
                                <div className="relative w-12 h-12 rounded overflow-hidden">
                                    {vinyl.cover_image ? (
                                        <Image
                                            src={vinyl.cover_image}
                                            alt={vinyl.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                            No Img
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="p-4 font-medium">
                                <Link href={`/dashboard/album/${vinyl.id}`}>
                                    {vinyl.title}
                                </Link>
                            </td>
                            <td className="p-4">{vinyl.artist}</td>
                            <td className="p-4">{vinyl.year || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
