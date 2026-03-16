import { render, screen } from '@testing-library/react';
import { PhotoFeed } from '@/app/_components/PhotoFeed';
import { usePhotoFeed } from '@/app/_hooks/usePhotoFeed';
import { useIntersectionObserver } from '@/app/_hooks/useIntersectionObserver';
import { mockPhoto } from '../__mocks__/photo.mock';

jest.mock('@/app/_hooks/usePhotoFeed');
jest.mock('@/app/_hooks/useIntersectionObserver');
jest.mock('@/app/_components/PhotoCard', () => ({
  PhotoCard: ({ photo }: { photo: { alt_description: string } }) => (
    <div data-testid="photo-card">{photo.alt_description}</div>
  ),
}));
jest.mock('@/app/_components/SearchField', () => ({
  SearchField: ({ onSearch }: { onSearch: (v: string) => void }) => (
    <input
      data-testid="search-field"
      onChange={(e) => onSearch(e.target.value)}
      placeholder="Search..."
    />
  ),
}));
jest.mock('@/app/_components/LoaderIcon', () => ({
  LoaderIcon: () => <div data-testid="loader" />,
}));

const mockUsePhotoFeed = usePhotoFeed as jest.MockedFunction<typeof usePhotoFeed>;
const mockUseIntersectionObserver = useIntersectionObserver as jest.MockedFunction<
  typeof useIntersectionObserver
>;

const defaultIntersectionObserver = {
  ref: { current: null },
  isIntersecting: false,
};

const defaultPhotoFeed = {
  data: undefined,
  fetchNextPage: jest.fn(),
  isFetchingNextPage: false,
  isLoading: false,
  isError: false,
  hasNextPage: true,
};

beforeEach(() => {
  mockUseIntersectionObserver.mockReturnValue(defaultIntersectionObserver);
  mockUsePhotoFeed.mockReturnValue(defaultPhotoFeed as never);
});

afterEach(() => jest.clearAllMocks());

describe('PhotoFeed', () => {
  describe('loading state', () => {
    it('shows a loader when isLoading is true', () => {
      mockUsePhotoFeed.mockReturnValue({
        ...defaultPhotoFeed,
        isLoading: true,
      } as never);

      render(<PhotoFeed />);

      expect(screen.getByTestId('loader')).toBeInTheDocument();
      expect(screen.queryByTestId('photo-card')).not.toBeInTheDocument();
    });

    it('shows a loader when fetching next page', () => {
      mockUsePhotoFeed.mockReturnValue({
        ...defaultPhotoFeed,
        isFetchingNextPage: true,
        data: { pages: [[mockPhoto]] },
      } as never);

      render(<PhotoFeed />);

      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    it('hides the loader when loading is complete', () => {
      mockUsePhotoFeed.mockReturnValue({
        ...defaultPhotoFeed,
        data: { pages: [[mockPhoto]] },
      } as never);

      render(<PhotoFeed />);

      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('shows an error message when isError is true', () => {
      mockUsePhotoFeed.mockReturnValue({
        ...defaultPhotoFeed,
        isError: true,
      } as never);

      render(<PhotoFeed />);

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    it('does not show error when loading', () => {
      mockUsePhotoFeed.mockReturnValue({
        ...defaultPhotoFeed,
        isLoading: true,
        isError: true,
      } as never);

      render(<PhotoFeed />);

      expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
    });

    it('does not show error when fetching next page', () => {
      mockUsePhotoFeed.mockReturnValue({
        ...defaultPhotoFeed,
        isFetchingNextPage: true,
        isError: true,
      } as never);

      render(<PhotoFeed />);

      expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
    });
  });

  describe('photos', () => {
    it('renders photo cards when data is available', () => {
      mockUsePhotoFeed.mockReturnValue({
        ...defaultPhotoFeed,
        data: { pages: [[mockPhoto, { ...mockPhoto, id: 'abc456' }]] },
      } as never);

      render(<PhotoFeed />);

      expect(screen.getAllByTestId('photo-card')).toHaveLength(2);
    });

    it('deduplicates photos with the same id across pages', () => {
      mockUsePhotoFeed.mockReturnValue({
        ...defaultPhotoFeed,
        data: { pages: [[mockPhoto], [mockPhoto]] },
      } as never);

      render(<PhotoFeed />);

      expect(screen.getAllByTestId('photo-card')).toHaveLength(1);
    });

    it('renders nothing when data is undefined', () => {
      render(<PhotoFeed />);
      expect(screen.queryByTestId('photo-card')).not.toBeInTheDocument();
    });
  });

  describe('infinite scroll', () => {
    it('calls fetchNextPage when sentinel is intersecting', () => {
      const fetchNextPage = jest.fn();

      mockUseIntersectionObserver.mockReturnValue({
        ref: { current: null },
        isIntersecting: true,
      });
      mockUsePhotoFeed.mockReturnValue({
        ...defaultPhotoFeed,
        fetchNextPage,
        data: { pages: [[mockPhoto]] },
      } as never);

      render(<PhotoFeed />);

      expect(fetchNextPage).toHaveBeenCalled();
    });

    it('does not call fetchNextPage when sentinel is not intersecting', () => {
      const fetchNextPage = jest.fn();

      mockUsePhotoFeed.mockReturnValue({
        ...defaultPhotoFeed,
        fetchNextPage,
        data: { pages: [[mockPhoto]] },
      } as never);

      render(<PhotoFeed />);

      expect(fetchNextPage).not.toHaveBeenCalled();
    });
  });

  describe('search', () => {
    it('renders the search field', () => {
      render(<PhotoFeed />);
      expect(screen.getByTestId('search-field')).toBeInTheDocument();
    });

    it('passes the query to usePhotoFeed when search changes', () => {
      render(<PhotoFeed />);

      expect(mockUsePhotoFeed).toHaveBeenCalledWith(undefined);
    });
  });
});
