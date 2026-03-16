import React, { useState } from 'react';
import { QueryClient, QueryClientProvider as TSQueryClientProvider } from '@tanstack/react-query';

interface QueryClientProviderProps {
  children: React.ReactNode;
}

export const QueryClientProvider = ({ children }: QueryClientProviderProps) => {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: 2 } } }),
  );
  return <TSQueryClientProvider client={queryClient}>{children}</TSQueryClientProvider>;
};
