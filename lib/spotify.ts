let accessToken: string | null = null;
let tokenExpiresAt: number = 0;

export async function getAccessToken(): Promise<string | null> {
    if (accessToken && Date.now() < tokenExpiresAt) {
        return accessToken;
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        console.error("Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET");
        return null;
    }

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${basicAuth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials'
        });

        if (!response.ok) {
            console.error('Failed to fetch Spotify access token:', response.statusText);
            return null;
        }

        const data = await response.json();
        accessToken = data.access_token;
        // expires_in is usually 3600 seconds. Subtract 5 minutes to be safe.
        tokenExpiresAt = Date.now() + (data.expires_in - 300) * 1000;
        
        return accessToken;
    } catch (error) {
        console.error('Error fetching Spotify access token:', error);
        return null;
    }
}

export async function searchSpotifyAlbum(artist: string, album: string): Promise<string | null> {
    const token = await getAccessToken();
    if (!token) return null;

    try {
        const query = `album:${album} artist:${artist}`;
        const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album&limit=5`;

        const response = await fetch(searchUrl, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error('Spotify Search API error:', response.statusText);
            return null;
        }

        const data = await response.json();
        const albums = data.albums?.items || [];
        
        if (albums.length > 0) {
            return albums[0].id;
        }
        
        return null;
    } catch (error) {
        console.error('Error searching Spotify album:', error);
        return null;
    }
}
