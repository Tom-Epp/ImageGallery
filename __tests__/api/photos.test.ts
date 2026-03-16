/**
 * @jest-environment node
 */

import { GET } from '@/app/api/photos/route';
import { NextRequest } from 'next/server';

const mockPhotos = [{ id: '1' }, { id: '2' }];
const mockSearchResult = { results: mockPhotos, total: 2, total_pages: 1 };

beforeEach(() => {
  global.fetch = jest.fn();
  process.env.UNSPLASH_ACCESS_KEY = 'test-key';
});

afterEach(() => jest.clearAllMocks());

describe('GET /api/photos', () => {
  describe('feed', () => {
    it('fetches photos when no query is provided', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPhotos,
      });

      const request = new NextRequest('http://localhost/api/photos?page=1');
      const response = await GET(request);
      const data = await response.json();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('api.unsplash.com/photos'),
        expect.any(Object),
      );
      expect(data).toEqual(mockPhotos);
    });

    it('passes page and per_page params', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPhotos,
      });

      const request = new NextRequest('http://localhost/api/photos?page=2&per_page=20');
      await GET(request);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=2&per_page=20'),
        expect.any(Object),
      );
    });

    it('includes the authorization header', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPhotos,
      });

      const request = new NextRequest('http://localhost/api/photos');
      await GET(request);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Client-ID test-key',
          }),
        }),
      );
    });
  });

  describe('search', () => {
    it('fetches photos when query is provided', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSearchResult,
      });

      const request = new NextRequest('http://localhost/api/photos?query=nature');
      const response = await GET(request);
      const data = await response.json();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('search/photos'),
        expect.any(Object),
      );
      expect(data).toEqual(mockPhotos);
    });

    it('encodes the search query in the URL', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSearchResult,
      });

      const request = new NextRequest('http://localhost/api/photos?query=black and white');
      await GET(request);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('black%20and%20white'),
        expect.any(Object),
      );
    });

    it('unwraps results from the search response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSearchResult,
      });

      const request = new NextRequest('http://localhost/api/photos?query=nature');
      const response = await GET(request);
      const data = await response.json();

      expect(data).toEqual(mockPhotos);
      expect(data.results).toBeUndefined();
    });
  });

  describe('error handling', () => {
    it('returns the upstream error status when the request fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 403 });

      const request = new NextRequest('http://localhost/api/photos');
      const response = await GET(request);

      expect(response.status).toBe(403);
    });

    it('returns a 500 when the upstream API returns a 500', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 500 });

      const request = new NextRequest('http://localhost/api/photos');
      const response = await GET(request);

      expect(response.status).toBe(500);
    });

    it('returns an error message in the response body', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 500 });

      const request = new NextRequest('http://localhost/api/photos');
      const response = await GET(request);
      const data = await response.json();

      expect(data).toEqual({ error: 'Failed to fetch photos' });
    });
  });
});
