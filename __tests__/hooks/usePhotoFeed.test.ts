import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePhotoFeed } from '@/app/_hooks/usePhotoFeed';
import { mockPhoto } from '../__mocks__/photo.mock';
import React from 'react';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  // eslint-disable-next-line react/display-name
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => jest.clearAllMocks());

describe('usePhotoFeed', () => {
  describe('without a search query', () => {
    it('fetches the first page on mount', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockPhoto],
      });

      const { result } = renderHook(() => usePhotoFeed(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.data?.pages[0]).toEqual([mockPhoto]);
    });

    it('sets isError when the request fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const { result } = renderHook(() => usePhotoFeed(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
    });

    it('uses the correct query key for the feed', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockPhoto],
      });

      const { result } = renderHook(() => usePhotoFeed(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('page=1'));
    });
  });

  describe('with a search query', () => {
    it('includes query param in the request', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockPhoto],
      });

      const { result } = renderHook(() => usePhotoFeed('nature'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('query=nature'));
    });

    it('uses a separate query key for search vs feed', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => [mockPhoto],
      });

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });

      const wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(QueryClientProvider, { client: queryClient }, children);

      const { result: feedResult } = renderHook(() => usePhotoFeed(), { wrapper });
      const { result: searchResult } = renderHook(() => usePhotoFeed('nature'), { wrapper });

      await waitFor(() => {
        expect(feedResult.current.isLoading).toBe(false);
        expect(searchResult.current.isLoading).toBe(false);
      });

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('pagination', () => {
    it('fetches the next page when fetchNextPage is called', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [mockPhoto],
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [{ ...mockPhoto, id: 'page2photo' }],
        });

      const { result } = renderHook(() => usePhotoFeed(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      void result.current.fetchNextPage();
      await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));

      expect(result.current.data?.pages[1]).toEqual([{ ...mockPhoto, id: 'page2photo' }]);
    });

    it('increments page param on each fetchNextPage call', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => [mockPhoto],
      });

      const { result } = renderHook(() => usePhotoFeed(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      void result.current.fetchNextPage();
      await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));

      expect(global.fetch).toHaveBeenNthCalledWith(2, expect.stringContaining('page=2'));
    });
  });
});
