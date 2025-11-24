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