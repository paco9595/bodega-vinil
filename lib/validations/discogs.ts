import { z } from 'zod'

// Basic sub-schemas
const ImageSchema = z.object({
    uri: z.string().optional(),
    height: z.number().optional(),
    width: z.number().optional(),
    resource_url: z.string().optional(),
    type: z.string().optional(),
    uri150: z.string().optional()
})

const ArtistSchema = z.object({
    name: z.string(),
    id: z.number(),
    resource_url: z.string().optional(),
    role: z.string().optional(),
    tracks: z.string().optional(),
    anv: z.string().optional(),
    join: z.string().optional()
})

// Main Release Schema
export const DiscogsReleaseSchema = z.object({
    id: z.number(),
    master_id: z.number().optional(),
    title: z.string(),
    year: z.union([z.number(), z.string()]).optional(), // API can return "Unknown" strings sometimes or numbers
    thumb: z.string().optional(),
    cover_image: z.string().optional(),
    resource_url: z.string().optional(),
    country: z.string().optional(),
    formats: z.array(z.object({
        name: z.string(),
        qty: z.string().optional(),
        descriptions: z.array(z.string()).optional()
    })).optional(),
    labels: z.array(z.object({
        name: z.string(),
        catno: z.string().optional(),
        id: z.number().optional()
    })).optional(),
    artists: z.array(ArtistSchema).optional(),
    genres: z.array(z.string()).optional(),
    styles: z.array(z.string()).optional(),
    tracklist: z.array(z.object({
        position: z.string().optional(),
        type_: z.string().optional(),
        title: z.string(),
        duration: z.string().optional()
    })).optional(),
    videos: z.array(z.object({
        uri: z.string(),
        title: z.string(),
        duration: z.number().optional()
    })).optional(),
    images: z.array(ImageSchema).optional(),
    uri: z.string().optional(),
}).passthrough() // Allow extra fields without failing

// Search Response Schema
export const DiscogsSearchResponseSchema = z.object({
    pagination: z.object({
        page: z.number(),
        pages: z.number(),
        per_page: z.number(),
        items: z.number()
    }),
    results: z.array(DiscogsReleaseSchema)
})

export type DiscogsRelease = z.infer<typeof DiscogsReleaseSchema>
export type DiscogsSearchResponse = z.infer<typeof DiscogsSearchResponseSchema>
