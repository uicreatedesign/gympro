import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
    imagePrimary?: string;
    imageSecondary?: string;
}

export default function ImageSwitcher({ imagePrimary, imageSecondary }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = [imagePrimary, imageSecondary].filter(Boolean);

    if (images.length === 0) return null;

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="relative w-full aspect-video rounded overflow-hidden bg-gray-100 dark:bg-gray-900 group cursor-pointer" onClick={handleNext}>
            <img
                src={`/storage/${images[currentIndex]}`}
                alt="Exercise"
                className="w-full h-full object-cover"
            />
            
            {images.length > 1 && (
                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handlePrev();
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleNext();
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>

                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-2 w-2 rounded-full transition-all ${
                                    idx === currentIndex ? 'bg-white w-6' : 'bg-white/50'
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
