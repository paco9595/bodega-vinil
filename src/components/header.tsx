import SearchIcon from "./icons/search";

export default function Header() {
    return (
        <header className="p-8 sticky top-0 backdrop-blur-md z-20">
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <SearchIcon size={20} color="var(--text-disabled-color)" />
                </div>
                <input type="text" id="input-group-1" className="block w-full ps-9 pe-3 py-2.5 rounded-lg bg-neutral-secondary-medium border border-[var(--text-disabled-color)] focus:border-white border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body" placeholder="Search by Artist, Album or Label" />
            </div>
        </header>
    )
}