import { render, screen } from '@testing-library/react';
import { PhotoCard } from '@/app/_components/PhotoCard';
import { mockPhoto } from '../__mocks__/photo.mock';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('PhotoCard', () => {
  it('renders the photo image with correct src and alt', () => {
    render(<PhotoCard photo={mockPhoto} tabIndex={0} />);

    const mainImage = screen.getByAltText(mockPhoto.alt_description!);
    expect(mainImage).toBeInTheDocument();
    expect(mainImage).toHaveAttribute('src', mockPhoto.urls.regular);
  });

  it('renders the photo with correct alt text', () => {
    render(<PhotoCard photo={mockPhoto} tabIndex={0} />);
    expect(screen.getByAltText(mockPhoto.alt_description!)).toBeInTheDocument();
  });

  it('renders the photographer name', () => {
    render(<PhotoCard photo={mockPhoto} tabIndex={0} />);
    expect(screen.getByText(mockPhoto.user.name)).toBeInTheDocument();
  });

  it('links to the photographer profile', () => {
    render(<PhotoCard photo={mockPhoto} tabIndex={0} />);

    const link = screen.getByRole('link', {
      name: new RegExp(`View ${mockPhoto.user.name}`, 'i'),
    });
    expect(link).toHaveAttribute('href', mockPhoto.user.links.html);
  });
});
