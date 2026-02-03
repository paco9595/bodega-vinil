'use client'
import useEmblaCarousel from 'embla-carousel-react'
import "@/styles/carrusel.css"
import { NextButton, PrevButton, usePrevNextButtons } from '@/hooks/usePrevCarouselBtn'

export default function Carrusel({ records, title, style }: { records: any, title?: string, style?: string }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, slidesToScroll: 'auto' })
    const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi)
    return (
        <div className=''>
            <div className="flex justify-between">
                <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-white to-gray-500">{title}</h2>
                <div className="flex gap-4">
                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
                </div>
            </div>
            <div className="embla">
                <div className="embla__viewport" ref={emblaRef}>
                    <div className="embla__container flex gap-4">
                        {records.map((record: any, index: number) => (
                            <div key={record.id} className="embla__slide bg-background rounded-lg overflow-hidden max-w-3xs">
                                <img src={record.cover_image} alt={record.title} className="w-full h-48 object-cover" />
                                <div className="py-4 pr-4">
                                    <h3 className="text-lg font-semibold">{style === 'top' ? index + 1 + '.- ' + record.title : record.title}</h3>
                                    <p className="text-sm text-muted-foreground">{record.artist}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}