import { PhotoCard } from '@/app/_components/PhotoCard';
import { useEffect, useMemo, useState } from 'react';
import { useIntersectionObserver } from '@/app/_hooks/useIntersectionObserver';
import type { Photo } from '@/app/_types/photo.types';
import { usePhotoFeed } from '@/app/_hooks/usePhotoFeed';
import { LoaderIcon } from '@/app/_components/LoaderIcon';
import { SearchField } from '@/app/_components/SearchField';
import { SortFilter } from '@/app/_components/SortFilter';
import type { SortOrder } from '@/app/_types/filters.types';

export const PhotoFeed = () => {
  const [query, setQuery] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest');

  const { data, fetchNextPage, isFetchingNextPage, isLoading, isError } = usePhotoFeed(query);
  const { ref, isIntersecting } = useIntersectionObserver();

  const onSearch = (value: string) => setQuery(value);

  const photos = useMemo(() => {
    if (!data) return [];

    return data.pages
      .flatMap((page) => page)
      .filter((photo, index, self) => index === self.findIndex((p) => p.id === photo.id));
  }, [data]);

  const sortedPhotos = useMemo(() => {
    return [...photos].sort((a, b) => {
      if (sortOrder === 'latest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortOrder === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortOrder === 'most_liked') {
        return b.likes - a.likes;
      }
      return 0;
    });
  }, [photos, sortOrder]);

  const columns = useMemo(() => {
    const TOTAL_COLUMNS = 3;
    if (!sortedPhotos) return [];

    return sortedPhotos.reduce<Photo[][]>(
      (acc, photo, index) => {
        acc[index % TOTAL_COLUMNS].push(photo);
        return acc;
      },
      Array.from({ length: TOTAL_COLUMNS }, () => []),
    );
  }, [sortedPhotos]);

  useEffect(() => {
    if (isIntersecting) {
      void fetchNextPage();
    }
  }, [fetchNextPage, isIntersecting]);

  return (
    <div className="w-full min-h-screen p-3 md:p-6">
      <div className="max-w-5xl mx-auto">
        <SearchField onSearch={onSearch} />
        <SortFilter selected={sortOrder} onChange={setSortOrder} />
        {isLoading ? (
          <div className="flex justify-center items-center w-full h-full my-4">
            <LoaderIcon />
          </div>
        ) : (
          <div className="flex gap-2 md:gap-3 items-start">
            {columns.map((column, colIndex) => (
              <div key={colIndex} className="flex flex-col flex-1 gap-2 md:gap-3">
                {column.map((photo) => (
                  <PhotoCard key={photo.id} photo={photo} tabIndex={sortedPhotos.indexOf(photo)} />
                ))}
              </div>
            ))}
          </div>
        )}
        <div ref={ref} className="h-1 w-full" />
        {isFetchingNextPage && (
          <div className="flex justify-center items-center w-full h-full my-4">
            <LoaderIcon />
          </div>
        )}
        {!isLoading && !isFetchingNextPage && isError && (
          <p className="my-4 text-sm md:text-lg text-center text-zinc-900 dark:text-zinc-100">
            Something went wrong. Please try again later.
          </p>
        )}
      </div>
    </div>
  );
};
