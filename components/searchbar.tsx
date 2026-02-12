import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef } from "react";

export function SearchBar({
    query,
    onChange,
    showFilters,
    onToggleFilters,
}: {
    query: string;
    onChange: (value: string) => void;
    showFilters: boolean;
    onToggleFilters: () => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
                ref={inputRef}
                value={query}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search albums or artists..."
                className="w-full bg-zinc-900 text-white pl-12 pr-12 py-4 rounded-2xl"
            />

            {query && (
                <button
                    onClick={() => onChange('')}
                    className="absolute right-12 top-1/2 -translate-y-1/2"
                >
                    <X className="w-4 h-4 text-zinc-400" />
                </button>
            )}

            <button
                onClick={onToggleFilters}
                className={`absolute right-4 top-1/2 -translate-y-1/2 ${showFilters ? 'text-amber-500' : 'text-zinc-400'
                    }`}
            >
                <SlidersHorizontal />
            </button>
        </div>
    );
}