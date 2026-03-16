import { useInfiniteQuery } from '@tanstack/react-query';
import { Time } from '@/app/_constants/time';
import type { Photo } from '@/app/_types/photo.types';
import type { SortOrder } from '@/app/_types/filters.types';

async function fetchImages(
  page: number,
  query?: string,
  orderBy: SortOrder = 'latest',
  perPage = 15,
) {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
    ...(query && { query }),
    ...(query && { order_by: orderBy }),
  });

  const response = await fetch(`/api/photos?${params}`);

  if (!response.ok) {
    throw new Error('Failed to fetch images');
  }

  return response.json();
}

export const usePhotoFeed = (query?: string, orderBy: SortOrder = 'latest') => {
  return useInfiniteQuery({
    queryKey: ['feed', query, orderBy],
    queryFn: ({ pageParam = 1 }) => fetchImages(pageParam, query, orderBy),
    getNextPageParam: (_lastPage: Photo[], allPages: Array<Photo[]>) => allPages.length + 1,
    staleTime: query ? Time.TEN_MINUTES : Time.FIVE_MINUTES,
    cacheTime: query ? Time.THIRTY_MINUTES : Time.TEN_MINUTES,
  });
};
