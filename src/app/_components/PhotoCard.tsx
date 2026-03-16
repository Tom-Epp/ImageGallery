import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import Image from 'next/image';
import type { Photo } from '@/app/_types/photo.types';
import Link from 'next/link';

interface PhotoCardProps {
  photo: Photo;
  tabIndex: number;
  priority?: boolean;
}

export const PhotoCard = ({ photo, tabIndex, priority }: PhotoCardProps) => {
  const [loaded, setLoaded] = useState(false);
  const [focused, setFocused] = useState(false);

  const onImageLoad = () => setLoaded(true);
  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      window.open(photo.links.html, '_blank', 'noopener noreferrer');
    }
  };

  return (
    <div
      onKeyDown={onKeyDown}
      role="article"
      tabIndex={tabIndex}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className="group relative overflow-hidden rounded-xl bg-neutral-100 cursor-pointer aspect-square focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
    >
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${loaded ? 'opacity-0' : 'opacity-100'}`}
        style={{ backgroundColor: photo.color }}
      >
        <Image
          alt=""
          src={photo.urls.thumb}
          fill
          sizes="(max-width: 768px) 33vw, 33vw"
          aria-hidden
          className="w-full h-full object-cover blur-xl scale-110"
        />
      </div>

      <Image
        priority={priority}
        src={photo.urls.regular}
        alt={photo.alt_description ?? ''}
        fill
        sizes="(max-width: 768px) 33vw, 33vw"
        className={`object-cover transition-all duration-500 group-hover:scale-105 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={onImageLoad}
      />

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 group-focus-within:bg-black/30 transition-colors duration-300">
        <div
          className={`absolute bottom-0 left-0 right-0 p-3 transition-transform duration-300 ${
            focused ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'
          }`}
        >
          <Link
            href={photo.user.links.html}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${photo.user.name}'s profile`}
            tabIndex={focused ? 0 : -1}
          >
            <p className="text-white text-sm font-medium truncate hover:underline">
              {photo.user.name}
            </p>
          </Link>
          {photo.alt_description && (
            <p className="text-white/70 text-xs truncate mt-0.5">{photo.alt_description}</p>
          )}
        </div>
      </div>
    </div>
  );
};
