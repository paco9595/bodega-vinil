
interface SortOptionProps {
    label: string;
    active: boolean;
    onClick: () => void;
}

export function SortOption({ label, active, onClick }: SortOptionProps) {
    return (
        <button
            onClick={onClick}
            className={`w-full px-4 py-3 text-left text-sm hover:bg-zinc-800 transition-colors ${active ? 'text-amber-500' : 'text-zinc-300'
                }`}
        >
            {label}
        </button>
    );
}
