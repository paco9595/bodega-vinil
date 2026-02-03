export default function SkeletonCard() {
    return (
        <div className="group relative bg-white/5 rounded-xl overflow-hidden border border-white/10 transition-all duration-300 animate-pulse">
            <div className="aspect-square relative bg-white/10"></div>
            <div className="p-4 space-y-3">
                <div className="space-y-2">
                    <div className="h-6 bg-white/10 rounded w-3/4"></div>
                    <div className="h-4 bg-white/10 rounded w-1/4"></div>
                </div>
                <div className="flex gap-2">
                    <div className="flex-1 h-12 bg-white/10 rounded-lg"></div>
                    <div className="flex-1 h-12 bg-white/10 rounded-lg"></div>
                </div>
            </div>
        </div>
    )
}
