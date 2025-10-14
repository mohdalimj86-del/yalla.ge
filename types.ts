
export enum Language {
  EN = 'en',
  AR = 'ar',
  KA = 'ka', // Georgian
  RU = 'ru', // Russian
  TR = 'tr', // Turkish
}

export enum ListingCategory {
  Accommodation = 'Accommodation',
  Marketplace = 'Marketplace',
  Explore = 'Explore',
}

export interface Listing {
  id: number;
  category: ListingCategory;
  title: string;
  description: string;
  price?: string;
  imageUrl: string;
  location: string;
  author: string;
  rating?: number;
  status?: 'approved' | 'pending';
}

export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  avatarUrl?: string;
  verified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: number;
}