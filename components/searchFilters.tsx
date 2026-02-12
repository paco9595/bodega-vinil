type SearchType = 'all' | 'album' | 'artist';

export function SearchFilters({
    genres,
    searchType,
    onSearchTypeChange,
    selectedGenre,
    onGenreChange,
    yearRange,
    onYearRangeChange,
}: {
    genres: string[];
    searchType: SearchType;
    onSearchTypeChange: (type: SearchType) => void;
    selectedGenre: string;
    onGenreChange: (genre: string) => void;
    yearRange: [number, number];
    onYearRangeChange: (range: [number, number]) => void;
}) {
    return (
        <div className="mb-6 p-4 bg-zinc-900 rounded-2xl space-y-4">
            <section>
                <label className="text-sm text-zinc-400">Type</label>
                <div className="flex gap-2">
                    {(['all', 'album', 'artist'] as const).map(type => (
                        <FilterButton
                            key={type}
                            active={searchType === type}
                            onClick={() => onSearchTypeChange(type)}
                        >
                            {type}
                        </FilterButton>
                    ))}
                </div>
            </section>

            <section>
                <label className="text-sm text-zinc-400">Genre</label>
                <div className="flex flex-wrap gap-2">
                    {genres.slice(0, 8).map(genre => (
                        <FilterButton
                            key={genre}
                            active={selectedGenre === genre}
                            onClick={() => onGenreChange(genre)}
                        >
                            {genre}
                        </FilterButton>
                    ))}
                </div>
            </section>

            <section>
                <label className="text-sm text-zinc-400">
                    Year: {yearRange[0]} - {yearRange[1]}
                </label>
                <div className="flex gap-3">
                    <input
                        type="range"
                        min="1950"
                        max="2024"
                        value={yearRange[0]}
                        onChange={(e) =>
                            onYearRangeChange([+e.target.value, yearRange[1]])
                        }
                    />
                    <input
                        type="range"
                        min="1950"
                        max="2024"
                        value={yearRange[1]}
                        onChange={(e) =>
                            onYearRangeChange([yearRange[0], +e.target.value])
                        }
                    />
                </div>
            </section>
        </div>
    );
}
interface FilterButtonProps {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

function FilterButton({ active, onClick, children }: FilterButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${active
                ? 'bg-amber-500 text-white'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
        >
            {children}
        </button>
    );
}
