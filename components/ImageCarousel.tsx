'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageCarouselProps {
  file_info: any[];
  objectFit?: 'cover' | 'contain';
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  file_info,
  objectFit = 'cover'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Derive imageUrls from file_info, ensuring no undefined values
  const imageUrls =
    file_info && file_info.length > 0
      ? file_info.map((file) => file.file_content || '/no_image.jpg')
      : ['/no_image.jpg'];

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? imageUrls.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isLastSlide = currentIndex === imageUrls.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="relative h-full w-full">
      {imageUrls.length > 0 ? (
        <div className="group relative h-full w-full overflow-hidden rounded-md">
          <Image
            src={imageUrls[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            fill
            style={{ objectFit }}
            className="rounded-md transition-transform duration-300 group-hover:scale-105"
          />
          {imageUrls.length > 1 && (
            <>
              <Button
                variant="ghost"
                className="absolute left-2 top-1/2 -translate-y-1/2 transform bg-black bg-opacity-50 p-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:bg-opacity-75"
                onClick={goToPrevious}
              >
                <ChevronLeft size={20} className="text-white" />
              </Button>
              <Button
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 transform bg-black bg-opacity-50 p-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:bg-opacity-75"
                onClick={goToNext}
              >
                <ChevronRight size={20} className="text-white" />
              </Button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 transform">
                {imageUrls.map((_, index) => (
                  <span
                    key={index}
                    className={`mx-1 inline-block h-2 w-2 rounded-full ${
                      index === currentIndex ? 'bg-white' : 'bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="relative h-full w-full">
          <Image
            src="/no_image.jpg"
            alt="No image available"
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
