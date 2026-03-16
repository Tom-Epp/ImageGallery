import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = searchParams.get('page') ?? '1';
  const perPage = searchParams.get('per_page') ?? '10';
  const query = searchParams.get('query');

  const url = query
    ? `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`
    : `https://api.unsplash.com/photos?page=${page}&per_page=${perPage}`;

  const response = await fetch(url, {
    headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(query ? data.results : data, {
    headers: {
      'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
    },
  });
}
