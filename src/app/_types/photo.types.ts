interface ProfileImage {
  small: string;
  medium: string;
  large: string;
}

interface UserLinks {
  self: string;
  html: string;
  photos: string;
  likes: string;
  portfolio: string;
}

interface UserSocial {
  instagram_username: string | null;
  portfolio_url: string | null;
  twitter_username: string | null;
  paypal_email: string | null;
}

interface User {
  id: string;
  updated_at: string;
  username: string;
  name: string;
  first_name: string;
  last_name: string | null;
  twitter_username: string | null;
  portfolio_url: string | null;
  bio: string | null;
  location: string | null;
  links: UserLinks;
  profile_image: ProfileImage;
  instagram_username: string | null;
  total_collections: number;
  total_likes: number;
  total_photos: number;
  total_free_photos: number;
  total_promoted_photos: number;
  total_illustrations: number;
  total_free_illustrations: number;
  total_promoted_illustrations: number;
  accepted_tos: boolean;
  for_hire: boolean;
  social: UserSocial;
}

interface Sponsorship {
  impression_urls: string[];
  tagline: string;
  tagline_url: string;
  sponsor: User;
}

interface PhotoUrls {
  raw: string;
  full: string;
  regular: string;
  small: string;
  thumb: string;
  small_s3: string;
}

interface PhotoLinks {
  self: string;
  html: string;
  download: string;
  download_location: string;
}

interface TopicSubmission {
  status: string;
  approved_on?: string;
}

export interface TopicSubmissions {
  experimental?: TopicSubmission;
  wallpapers?: TopicSubmission;
  nature?: TopicSubmission;
  travel?: TopicSubmission;
  people?: TopicSubmission;
  'street-photography'?: TopicSubmission;
}

export interface AlternativeSlugs {
  en: string;
  es: string;
  ja: string;
  fr: string;
  it: string;
  ko: string;
  de: string;
  pt: string;
  id: string;
}

export interface Photo {
  id: string;
  slug: string;
  alternative_slugs: AlternativeSlugs;
  created_at: string;
  updated_at: string;
  promoted_at: string | null;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  description: string | null;
  alt_description: string | null;
  breadcrumbs: unknown[];
  urls: PhotoUrls;
  links: PhotoLinks;
  likes: number;
  liked_by_user: boolean;
  bookmarked: boolean;
  current_user_collections: unknown[];
  sponsorship: Sponsorship | null;
  topic_submissions: TopicSubmissions;
  asset_type: 'photo';
  user: User;
}
