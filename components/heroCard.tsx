export default function HeroCard() {
    return (
        <section>
            <div className="relative h-64 rounded-3xl overflow-hidden bg-gradient-to-br from-amber-600 via-orange-700 to-red-900 p-6 flex flex-col justify-end shadow-2xl">
                <div className="relative z-10">
                    <p className="text-amber-200 text-sm mb-2">Featured Album</p>
                    <h2 className="text-3xl font-light mb-1">Random Access Memories</h2>
                    <p className="text-zinc-200 text-sm">Daft Punk • 2013</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
        </section>
    )
}