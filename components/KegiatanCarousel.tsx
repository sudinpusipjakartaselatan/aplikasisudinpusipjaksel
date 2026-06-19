'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface KegiatanCarouselProps {
  imageUrls: string[];
  title: string;
}

export default function KegiatanCarousel({ imageUrls, title }: KegiatanCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1));
  }, [imageUrls.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1));
  }, [imageUrls.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  if (!imageUrls || imageUrls.length === 0) return null;

  if (imageUrls.length === 1) {
    return (
      <div className="relative w-full h-[300px] md:h-[450px]">
        <Image src={imageUrls[0]} alt={title} fill className="object-cover" priority />
      </div>
    );
  }

  return (
    <div className="flex flex-col border-b border-slate-100 bg-white">
      {/* Main Slider */}
      <div className="relative w-full h-[300px] md:h-[450px] group overflow-hidden bg-slate-100">
        <Image
          src={imageUrls[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          fill
          className="object-cover transition-transform duration-700"
          priority
        />
        
        {/* Navigation Arrows */}
        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={prevSlide}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur text-slate-800 flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all z-10"
            aria-label="Previous image"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 md:w-6 md:h-6"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button 
            onClick={nextSlide}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur text-slate-800 flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all z-10"
            aria-label="Next image"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 md:w-6 md:h-6"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
        
        {/* Counter */}
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-white text-xs font-bold shadow-lg">
          {currentIndex + 1} / {imageUrls.length}
        </div>
      </div>

      {/* Thumbnails (Moving/Scrollable) */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 overflow-x-auto hide-scrollbar">
        <div className="flex gap-3 snap-x snap-mandatory pb-2">
          {imageUrls.map((url, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-24 h-16 md:w-32 md:h-20 shrink-0 rounded-xl overflow-hidden snap-start transition-all ${
                currentIndex === idx 
                  ? 'ring-4 ring-primary ring-offset-2 scale-100 opacity-100 shadow-md' 
                  : 'opacity-50 hover:opacity-100 scale-95 hover:scale-100'
              }`}
            >
              <Image
                src={url}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 96px, 128px"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
