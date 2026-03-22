'use client';

import { useEffect, useState } from 'react';

interface SpotifyAlbumEmbedProps {
    artist: string;
    album: string;
}

export function SpotifyAlbumEmbed({ artist, album }: SpotifyAlbumEmbedProps) {
    const [albumId, setAlbumId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlbumId = async () => {
            try {
                const searchParams = new URLSearchParams({ artist, album });
                const res = await fetch(`/api/spotify/search?${searchParams.toString()}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.albumId) {
                        setAlbumId(data.albumId);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch Spotify album ID', error);
            } finally {
                setLoading(false);
            }
        };

        if (artist && album) {
            fetchAlbumId();
        } else {
            setLoading(false);
        }
    }, [artist, album]);

    if (loading) {
        return (
            <div className="w-full h-[152px] bg-white/5 animate-pulse rounded-xl mt-8"></div>
        );
    }

    if (!albumId) {
        return null;
    }

    return (
        <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 text-white">Escuchar en Spotify</h3>
            <iframe
                src={`https://open.spotify.com/embed/album/${albumId}`}
                width="100%"
                height="152"
                frameBorder="0"
                allowFullScreen={false}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-xl border-none"
            ></iframe>
        </div>
    );
}
