import { useCallback, useEffect, useState } from "react";

export function useCarousel(itemCount, autoPlayInterval = 5000) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev === itemCount - 1 ? 0 : prev + 1));
  }, [itemCount]);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev === 0 ? itemCount - 1 : prev - 1));
  }, [itemCount]);

  useEffect(() => {
    let interval;

    if (!isPaused) {
      interval = setInterval(() => {
        nextSlide();
      }, autoPlayInterval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPaused, nextSlide, autoPlayInterval]);

  return {
    activeSlide,
    setActiveSlide,
    isPaused,
    setIsPaused,
    nextSlide,
    prevSlide,
  };
}
