import { useEffect, useState } from 'react';

export function useMediaQuery(query: string, fallback = false) {
  const [matches, setMatches] = useState(fallback);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);
  return matches;
}