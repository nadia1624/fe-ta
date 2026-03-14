import { useState, useEffect } from 'react';
import { Newspaper, ChevronLeft, ChevronRight } from 'lucide-react';

interface NewsSliderProps {
  dokumentasis: any[];
  judul: string;
}

export const NewsSlider = ({ dokumentasis, judul }: NewsSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!dokumentasis || dokumentasis.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % dokumentasis.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [dokumentasis, isHovered]);

  if (!dokumentasis || dokumentasis.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <Newspaper className="w-10 h-10 text-gray-300" />
      </div>
    );
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? dokumentasis.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === dokumentasis.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="relative w-full h-full group select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {dokumentasis.map((doc, idx) => {
        const url = `/api/uploads/berita/${doc.file_path.replace(/\\/g, '/')}`;
        return (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === currentIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10'
              }`}
          >
            <img
              src={url}
              alt={`${judul} - ${idx + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        );
      })}

      {dokumentasis.length > 1 && (
        <>
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/60 z-20 cursor-pointer active:scale-95"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/60 z-20 cursor-pointer active:scale-95"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {dokumentasis.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/40 hover:bg-white/70'
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
