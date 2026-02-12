'use client'
import { Check } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { DiscogsRelease } from '@/lib/types/DiscogsRelease';
import AlbumDetailModal from './albumDetailmodal';
import { Vinyl } from '@/lib/types/tables';
interface cardProps {
    album: DiscogsRelease;
    showInCollection?: boolean;
}

export function Card({ album, showInCollection = false }: cardProps) {
    const imageUrl = Array.isArray(album.images) ? album.images[0].uri : (album.cover_image ?? album.thumb);
    return (
        <div
            className="group relative text-left w-full"
        >

            <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 shadow-lg">
                <img
                    src={imageUrl}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {showInCollection && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
                <p className="font-medium text-sm line-clamp-1 mb-0.5">{album.title}</p>
                <p className="text-xs text-zinc-400 line-clamp-1">{album?.artists?.map((artist) => artist.name).join(', ')}</p>
                <p className="text-xs text-zinc-500 mt-1">{album.year}</p>
            </div>
        </div>
    );
}

export function AlbumDrawer({ children, album }: { children: React.ReactNode, album: DiscogsRelease & Partial<Vinyl> }) {
    return (
        <Drawer direction='bottom'>
            <DrawerTrigger asChild >
                {children}
            </DrawerTrigger>
            <DrawerContent dragable={true} className='rounded-t-4xl'>
                <AlbumDetailModal album={album} />
            </DrawerContent>
        </Drawer>
    )
}

export function AlbumCardDrawer({ album }: { album: DiscogsRelease & Partial<Vinyl> }) {
    return (
        <AlbumDrawer album={album}>
            <div>
                <Card album={album} />
            </div>
        </AlbumDrawer>
    )
}

