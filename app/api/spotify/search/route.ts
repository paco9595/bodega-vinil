import { NextRequest, NextResponse } from "next/server";
import { searchSpotifyAlbum } from "@/lib/spotify";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const artist = searchParams.get("artist");
    const album = searchParams.get("album");

    if (!artist || !album || artist.trim() === "" || album.trim() === "") {
        return NextResponse.json({ error: "Missing artist or album parameter" }, { status: 400 });
    }

    try {
        const albumId = await searchSpotifyAlbum(artist, album);
        return NextResponse.json({ albumId });
    } catch (error) {
        console.error("Error in spotify search route:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
