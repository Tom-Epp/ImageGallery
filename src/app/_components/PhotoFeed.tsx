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

  const { data, fetchNextPage, isFetchingNextPage, isLoading, isError } = usePhotoFeed(
    query,
    sortOrder,
  );

  const { ref, isIntersecting } = useIntersectionObserver();

  const onSearch = (value: string) => setQuery(value);

  const photos = useMemo(() => {
    if (!data) return [];

    return data.pages
      .flatMap((page) => page)
      .filter((photo, index, self) => index === self.findIndex((p) => p.id === photo.id));
  }, [data]);

  useEffect(() => {
    if (isIntersecting) {
      void fetchNextPage();
    }
  }, [fetchNextPage, isIntersecting]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center w-full my-4">
          <LoaderIcon />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex justify-center items-center w-full my-12">
          <p className="text-sm md:text-lg text-center text-zinc-900 dark:text-zinc-100">
            Something went wrong. Please try again later.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-3 gap-2 min-h-screen">
        {photos.map((photo: Photo, index: number) => (
          <PhotoCard key={photo.id} photo={photo} tabIndex={index} priority={index < 6} />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen p-3 md:p-6">
      <div className="max-w-5xl mx-auto">
        <SearchField onSearch={onSearch} />
        {query && <SortFilter selected={sortOrder} onChange={setSortOrder} />}
        {renderContent()}
        <div ref={ref} className="h-1 w-full" />
        {isFetchingNextPage && (
          <div className="flex justify-center items-center w-full h-full my-4">
            <LoaderIcon />
          </div>
        )}
      </div>
    </div>
  );
};
