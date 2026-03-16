'use client';

import { PhotoFeed } from '@/app/_components/PhotoFeed';
import { QueryClientProvider } from '@/app/_providers/QueryClientProvider';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <main className="w-full mx-auto">
        <QueryClientProvider>
          <PhotoFeed />
        </QueryClientProvider>
      </main>
    </div>
  );
}
