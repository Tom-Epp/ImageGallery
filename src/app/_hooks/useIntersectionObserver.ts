import { useEffect, useRef, useState } from 'react';

export function useIntersectionObserver() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const elementObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsIntersecting(entry.isIntersecting);
      },
      { rootMargin: '500px' },
    );

    elementObserver.observe(element);
    return () => elementObserver.disconnect();
  }, []);

  return { ref, isIntersecting };
}
