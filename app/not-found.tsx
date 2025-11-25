import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="mt-40 flex flex-col items-center justify-center text-black p-4">
            <div className="text-center space-y-6">
                <div className="relative w-48 h-48 mx-auto animate-[spin_3s_linear_infinite]">
                    {/* Vinyl Record Representation */}
                    <div className="w-full h-full rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center relative overflow-hidden shadow-2xl">
                        {/* Grooves */}
                        <div className="absolute inset-0 rounded-full border-[2px] border-neutral-800 opacity-50 scale-[0.95]"></div>
                        <div className="absolute inset-0 rounded-full border-[2px] border-neutral-800 opacity-50 scale-[0.9]"></div>
                        <div className="absolute inset-0 rounded-full border-[2px] border-neutral-800 opacity-50 scale-[0.85]"></div>
                        <div className="absolute inset-0 rounded-full border-[2px] border-neutral-800 opacity-50 scale-[0.8]"></div>
                        <div className="absolute inset-0 rounded-full border-[2px] border-neutral-800 opacity-50 scale-[0.75]"></div>
                        <div className="absolute inset-0 rounded-full border-[2px] border-neutral-800 opacity-50 scale-[0.7]"></div>
                        <div className="absolute inset-0 rounded-full border-[2px] border-neutral-800 opacity-50 scale-[0.65]"></div>

                        {/* Label */}
                        <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center z-10 shadow-inner">
                            <div className="w-3 h-3 rounded-full bg-black"></div>
                        </div>

                        {/* Reflection/Shine */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-full pointer-events-none"></div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-6xl font-bold tracking-tighter">404</h1>
                    <h2 className="text-2xl font-medium text-neutral-400">Página no encontrada</h2>
                </div>

                <p className="text-neutral-500 max-w-md mx-auto">
                    Parece que el disco que buscas está rayado o no existe en nuestra colección.
                </p>

                <Link
                    href="/"
                    className="inline-block px-8 py-3 rounded-full bg-white font-medium hover:bg-neutral-200 transition-colors hover:scale-105 transform duration-200"
                >
                    Volver al inicio
                </Link>
            </div>
        </div>
    )
}
