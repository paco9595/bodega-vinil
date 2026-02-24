import { Vinyl } from "@/lib/types/tables"

export function NormalizeString(str: string) {
    if (!str) return ""
    return str
        .normalize("NFD")            // separa acentos
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase().trim()
}

export function NormalizeYear(year: string) {
    if (!year) return ""
    return year.replace(/[^0-9]/g, "")
}

export const sortArray = (data: Vinyl[], sortBy: string) => {
    return [...data].sort((a, b) => {
        switch (sortBy) {
            case 'title':
                return a.title.localeCompare(b.title);
            case 'artist':
                return a.artist.localeCompare(b.artist);
            case 'year':
                return (Number(a.year) || 0) - (Number(b.year) || 0);
            default:
                return 0;
        }
    });
}

