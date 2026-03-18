'use client';
import { useState, useRef, useEffect } from 'react';
import '@/styles/flipCard.css'
import { AlbumDrawer } from '@/components/card';
interface CrateItem {
    id: string | number;
    title: string;
    artist: string;
    coverImage: string;
    year?: string | number;
}

export default function CrateDiggingView({ collection }: { collection: CrateItem[] }) {
    const [activeIndex, setActiveIndex] = useState(0);

    // Referencias para el scroll
    const wheelAccumulator = useRef(0);
    const lastScrollTime = useRef(0);

    // Referencias para el touch (pantalla táctil)
    const touchStartY = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const preventScroll = (e: Event) => {
            e.preventDefault();
        };

        // Se usa passive: false para poder cancelar el scroll nativo del navegador (pull-to-refresh o scroll general)
        el.addEventListener('touchmove', preventScroll, { passive: false });
        el.addEventListener('wheel', preventScroll, { passive: false });

        return () => {
            el.removeEventListener('touchmove', preventScroll);
            el.removeEventListener('wheel', preventScroll);
        };
    }, []);

    // -- SCROLL (Ratón y Trackpad) --
    const handleWheel = (e: React.WheelEvent) => {
        const now = Date.now();
        // Si dejamos de scrollear por un ratito, reiniciamos el acumulador
        if (now - lastScrollTime.current > 100) wheelAccumulator.current = 0;
        lastScrollTime.current = now;

        wheelAccumulator.current += e.deltaY;

        // Umbral: Cada vez que acumulamos "60" unidades de scroll, deslizamos un disco
        if (wheelAccumulator.current > 60) {
            setActiveIndex(prev => Math.min(prev + 1, collection.length - 1));
            wheelAccumulator.current -= 60; // Descontamos para que el scroll rápido arrastre varios
        } else if (wheelAccumulator.current < -60) {
            setActiveIndex(prev => Math.max(prev - 1, 0));
            wheelAccumulator.current += 60;
        }
    };

    // -- TACTIL (Smartphones y Tablets) --
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (touchStartY.current === null) return;

        const currentY = e.touches[0].clientY;
        const diff = touchStartY.current - currentY; // Positivo si deslizamos hacia arriba (avanzar)

        // Umbral: Cada 50px de deslizamiento continuo con el dedo avanza un disco
        if (diff > 50) {
            setActiveIndex(prev => Math.min(prev + 1, collection.length - 1));
            touchStartY.current = currentY; // Reiniciamos el punto origen para poder pasar varios en un solo gesto
        } else if (diff < -50) {
            setActiveIndex(prev => Math.max(prev - 1, 0));
            touchStartY.current = currentY;
        }
    };

    const handleTouchEnd = () => {
        touchStartY.current = null;
    };

    return (
        <div
            ref={containerRef}
            className="diggingView"
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {collection.map((item, index) => {
                // Mostramos hasta 5 discos que ya pasamos (para ver el montón de enfrente)
                // Y mostramos los siguientes 5 como esperando en la caja de atrás
                if (index < activeIndex - 5 || index >= activeIndex + 5) return null;

                const status = index < activeIndex ? 'passed' : index === activeIndex ? 'active' : 'stacked';

                // Si ya pasó, la distancia (visualIndex) aumenta hacia adelante. Si está apilado, aumenta hacia atrás.
                const visualIndex = Math.abs(index - activeIndex);

                return (
                    <AlbumDrawer album={item as any} key={`${item.id}-${index}`}>
                        <div
                            key={item.id}
                            className={`card ${status}`}
                            style={{
                                // Muy importante: 100 - index obliga a que el vinilo 0 siempre tape al vinilo 1
                                // Así los vemos apilados correctamente uno frente al otro en la caja real
                                zIndex: 100 - index,
                                // Pasamos visualIndex como variable CSS para calcular profundidad y sombra
                                '--visual-index': visualIndex
                            } as React.CSSProperties}
                        >
                            <div className="card-inner">
                                <div className="card-front">
                                    <img src={item.coverImage} alt={item.title} />
                                </div>

                            </div>
                        </div>
                    </AlbumDrawer>
                );
            })}
        </div>
    );
}
