export interface DiscogsRelease {
    id: number
    status: string
    year: number
    cover_image?: string
    resource_url: string
    uri: string
    artists: Artist[]
    artists_sort: string
    labels: Label[]
    series: any[]
    companies: Company[]
    formats: Format[]
    data_quality: string
    community: Community
    format_quantity: number
    date_added: string
    date_changed: string
    num_for_sale: number
    lowest_price: number
    master_id: number
    master_url: string
    title: string
    country: string
    released: string
    notes: string
    released_formatted: string
    identifiers: Identifier[]
    videos: Video[]
    genres: string[]
    styles: string[]
    tracklist: Tracklist[]
    extraartists: Extraartist[]
    images: Image[]
    thumb: string
    estimated_weight: number
    blocked_from_sale: boolean
    is_offensive: boolean
}

export interface Artist {
    name: string
    anv: string
    join: string
    role: string
    tracks: string
    id: number
    resource_url: string
    thumbnail_url: string
}

export interface Label {
    name: string
    catno: string
    entity_type: string
    entity_type_name: string
    id: number
    resource_url: string
    thumbnail_url: string
}

export interface Company {
    name: string
    catno: string
    entity_type: string
    entity_type_name: string
    id: number
    resource_url: string
    thumbnail_url?: string
}

export interface Format {
    name: string
    qty: string
    descriptions: string[]
}

export interface Community {
    have: number
    want: number
    rating: Rating
    submitter: Submitter
    contributors: Contributor[]
    data_quality: string
    status: string
}

export interface Rating {
    count: number
    average: number
}

export interface Submitter {
    username: string
    resource_url: string
}

export interface Contributor {
    username: string
    resource_url: string
}

export interface Identifier {
    type: string
    value: string
    description?: string
}

export interface Video {
    uri: string
    title: string
    description: string
    duration: number
    embed: boolean
}

export interface Tracklist {
    position: string
    type_: string
    title: string
    duration: string
}

export interface Extraartist {
    name: string
    anv: string
    join: string
    role: string
    tracks: string
    id: number
    resource_url: string
}

export interface Image {
    type: string
    uri: string
    resource_url: string
    uri150: string
    width: number
    height: number
}
export interface DiscogsSearchResponse {
    results: DiscogsRelease[]
    pagination: {
        page: number
        pages: number
        per_page: number
        items: number
    }
}