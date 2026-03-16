import { useInfiniteQuery } from '@tanstack/react-query';
import type { Photo } from '@/app/_types/photo.types';
import { Time } from '@/app/_constants/time';

async function fetchImages(page: number, query?: string, perPage = 15): Promise<Photo[]> {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
    ...(query && { query }),
  });

  const response = await fetch(`/api/photos?${params}`);

  if (!response.ok) {
    throw new Error('Failed to fetch images');
  }

  return response.json();
}

export const usePhotoFeed = (query?: string) => {
  return useInfiniteQuery({
    queryKey: ['feed', query],
    queryFn: ({ pageParam = 1 }) => fetchImages(pageParam, query),
    getNextPageParam: (_lastPage: Photo[], allPages: Array<Photo[]>) => allPages.length + 1,
    staleTime: query ? Time.TEN_MINUTES : Time.FIVE_MINUTES,
    cacheTime: query ? Time.THIRTY_MINUTES : Time.TEN_MINUTES,
  });
};
