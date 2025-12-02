import { Database } from "./database.types";

export type Vinyl = Database['public']['Tables']['vinyls']['Row']
export type Genre = Database['public']['Tables']['genres']['Row']
export type styles = Database['public']['Tables']['styles']['Row']
export type vinyl_genres = Database['public']['Tables']['vinyl_genres']['Row']
export type vinyl_styles = Database['public']['Tables']['vinyl_styles']['Row']
