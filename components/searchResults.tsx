import { DiscogsRelease } from "@/lib/types/DiscogsRelease";
import { Search } from "lucide-react";
import { SearchResultItem } from "./searchResultItem";

export function SearchResults({
    query,
    results
}: {
    query: string;
    results: DiscogsRelease[];
}) {
    if (!query) {
        return (
            <div className="text-center py-16">
                <Search className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500">Start typing to search</p>
            </div>
        );
    }

    return (
        <>
            <p className="text-sm text-zinc-400 mb-4">
                {results.length} result{results.length !== 1 && 's'}
            </p>
            <div className="space-y-2">
                {results.map(album => (
                    <SearchResultItem
                        key={album.id}
                        album={album}
                    />
                ))}
            </div>
        </>
    );
}