'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CrateItem {
    id: string | number;
    title: string;
    artist: string;
    coverImage: string;
    year?: string | number;
}

export default function CrateDiggingView({ collection }: { collection: CrateItem[] }) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!collection || collection.length === 0) {
        return <div className="text-center text-zinc-500 py-12">No albums in collection</div>;
    }

    // Mantenemos un índice virtual que puede crecer o decrecer infinitamente
    const nextRecord = () => setActiveIndex((prev) => prev + 1);
    const prevRecord = () => setActiveIndex((prev) => prev - 1);

    const handleDragEnd = (event: any, info: any) => {
        // Arrstrar hacia abajo (y > 40) o a la izquierda pasa al siguiente disco
        if (info.offset.y > 40 || info.offset.x < -40) {
            nextRecord();
        } else if (info.offset.y < -40 || info.offset.x > 40) {
            prevRecord();
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center w-full min-h-[60vh] overflow-hidden bg-zinc-950/30 rounded-2xl py-12">

            {/* Contenedor de los discos */}
            <div className="relative w-64 h-64 md:w-80 md:h-80" style={{ perspective: '1000px' }}>
                <AnimatePresence initial={false}>
                    {
                        // Creamos una ventana móvil virtual de "cartas" para que framer-motion 
                        // pueda animarlas sin que brinquen por la pantalla al reiniciar el ciclo
                        Array.from({ length: 25 }).map((_, i) => {
                            // El offset visual de cada carta (-12 a +12)
                            const offset = i - 12;
                            // El absoluteIndex es el índice global de la carta extendido a infinito
                            const absoluteIndex = activeIndex + offset;

                            // Calculamos qué disco corresponde a este índice usando módulo
                            const itemIndex = ((absoluteIndex % collection.length) + collection.length) % collection.length;
                            const record = collection[itemIndex];

                            if (!record) return null;

                            return (
                                <motion.div
                                    key={absoluteIndex} // Usar el índice absoluto evita los 'brincos'
                                    style={{ transformOrigin: "bottom center" }}
                                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                    dragElastic={0.6}
                                    onDragEnd={handleDragEnd}
                                    initial={{ opacity: 0, y: -50 }}
                                    animate={{
                                        opacity: Math.abs(offset) > 10 ? 0 : 1,
                                        // Los agrupamos a los lados horizontalmente
                                        x: offset === 0 ? 0 : offset < 0 ? Math.max(offset * 40, -180) : Math.min(offset * 40, 180),
                                        y: 0,
                                        scale: offset === 0 ? 1 : 0.85,
                                        // ¡Aquí está la magia! El disco gira sobre el eje Y
                                        // Si offset es negativo (ya lo pasaste), lo rotamos hacia dentro para que veamos el lomo o quede de canto
                                        rotateY: offset === 0 ? 0 : offset < 0 ? 50 : -50,
                                        // Ligera inclinación en Z para naturalidad al amontonarse
                                        rotateZ: offset === 0 ? 0 : offset < 0 ? -5 : 5,
                                        zIndex: 50 - Math.abs(offset),
                                        filter: offset === 0 ? "brightness(1.1) contrast(1.1)" : "brightness(0.3) contrast(0.9)"
                                    }}
                                    transition={{ type: "spring", stiffness: 260, damping: 25 }}
                                    className={`absolute top-0 left-0 w-full h-full cursor-grab active:cursor-grabbing will-change-transform ${offset === 0 ? 'drop-shadow-2xl' : 'drop-shadow-lg'}`}
                                    onClick={() => {
                                        if (offset !== 0) setActiveIndex(absoluteIndex);
                                    }}
                                >
                                    {/* Portada del Disco */}
                                    <div className={`w-full h-full relative rounded-md overflow-hidden border ${offset === 0 ? 'border-zinc-500/50' : 'border-black'} shadow-[20px_0_40px_rgba(0,0,0,0.8)]`}>
                                        <img
                                            src={record.coverImage || '/placeholder-cover.jpg'}
                                            alt={record.title}
                                            className="object-cover w-full h-full pointer-events-none"
                                            draggable={false}
                                        />

                                        {/* Etiqueta visible solo en el activo para un efecto genial */}
                                        {offset === 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                                className="absolute bottom-0 w-full bg-linear-to-t from-black/90 via-black/50 to-transparent pt-12 p-5 text-center"
                                            >
                                                <h3 className="text-white font-bold text-lg md:text-xl truncate drop-shadow-md">{record.title}</h3>
                                                <p className="text-zinc-300 text-sm md:text-base truncate drop-shadow-md">{record.artist} {record.year ? `• ${record.year}` : ''}</p>
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })
                    }
                </AnimatePresence>
            </div>

            {/* Controles de navegación de escritorio */}
            <div className="flex gap-16 mt-16 z-20">
                <button
                    onClick={prevRecord}
                    className="p-4 bg-zinc-800/80 backdrop-blur-md rounded-full text-white hover:bg-amber-500 hover:text-black transition-all"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={nextRecord}
                    className="p-4 bg-zinc-800/80 backdrop-blur-md rounded-full text-white hover:bg-amber-500 hover:text-black transition-all"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            {/* Indicador de progreso */}
            <div className="mt-8 text-zinc-500 text-sm font-medium tracking-widest">
                {(((activeIndex % collection.length) + collection.length) % collection.length) + 1} / {collection.length}
            </div>
        </div>
    );
}
