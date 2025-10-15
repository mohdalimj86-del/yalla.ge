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

export enum Badge {
  VerifiedReviewer = 'Verified Reviewer',
  TopContributor = 'Top Contributor',
  NewUser = 'New User',
}

export interface RatingDetails {
  overall: number;
  accuracy?: number;
  communication?: number;
  value?: number;
  service?: number;
}

export interface Review {
  id: number;
  listingId: number;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorBadges?: Badge[];
  rating: RatingDetails;
  comment: string;
  photos: string[]; // array of base64 image strings
  createdAt: string; // ISO date string
  helpfulVotes: number;
  notHelpfulVotes: number;
  reply?: {
    authorName: string;
    comment: string;
    createdAt: string;
  };
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
  reviews?: Review[];
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
  reviewCount?: number;
  badges?: Badge[];
}

export enum NotificationType {
  NewReview = 'NewReview',
  ListingApproved = 'ListingApproved',
  PriceChange = 'PriceChange',
  NewMessage = 'NewMessage',
  System = 'System',
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: string; // ISO date string
  link?: string; // e.g., /listing/1
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string; // ISO date string
  read: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage?: Message;
  unreadCount?: number;
}
