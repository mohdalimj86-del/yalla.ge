import { Listing, ListingCategory, Badge, Review, Notification, NotificationType, User, Conversation, Message } from '../types';

export const mockReviews: { [key: number]: Review[] } = {
  1: [
    {
      id: 101,
      listingId: 1,
      authorId: 'user1',
      authorName: 'Alex D.',
      authorAvatar: 'https://i.pravatar.cc/150?u=alex',
      authorBadges: [Badge.VerifiedReviewer],
      rating: { overall: 5, accuracy: 5, communication: 5, value: 5 },
      comment: "Absolutely perfect for a student. The location is amazing, right next to the metro. Nino was a great host, very communicative. Highly recommend!",
      photos: ["https://picsum.photos/seed/rev1/200/200", "https://picsum.photos/seed/rev2/200/200"],
      createdAt: new Date('2023-09-15T10:00:00Z').toISOString(),
      helpfulVotes: 12,
      notHelpfulVotes: 0,
    },
    {
      id: 102,
      listingId: 1,
      authorId: 'user2',
      authorName: 'Sophie B.',
      authorAvatar: 'https://i.pravatar.cc/150?u=sophie',
      rating: { overall: 4, accuracy: 4, communication: 5, value: 4 },
      comment: "Great place, a bit smaller than expected but very clean and has everything you need. The host is very responsive.",
      photos: [],
      createdAt: new Date('2023-10-01T14:30:00Z').toISOString(),
      helpfulVotes: 5,
      notHelpfulVotes: 1,
    }
  ],
  4: [
    {
      id: 401,
      listingId: 4,
      authorId: 'user3',
      authorName: 'Mike R.',
      authorAvatar: 'https://i.pravatar.cc/150?u=mike',
      authorBadges: [Badge.TopContributor],
      rating: { overall: 5, value: 5, accuracy: 5 },
      comment: "The MacBook was exactly as described. Met with Luka, very nice guy. The laptop works perfectly. Great value for the price!",
      photos: [],
      createdAt: new Date('2023-11-20T18:00:00Z').toISOString(),
      helpfulVotes: 25,
      notHelpfulVotes: 0,
      reply: {
        authorName: 'Luka T.',
        comment: 'Thanks Mike! Glad you like it.',
        createdAt: new Date('2023-11-21T09:00:00Z').toISOString(),
      }
    }
  ],
  7: [
     {
      id: 701,
      listingId: 7,
      authorId: 'user4',
      authorName: 'Elena P.',
      authorAvatar: 'https://i.pravatar.cc/150?u=elena',
      authorBadges: [Badge.VerifiedReviewer],
      rating: { overall: 5, service: 5, value: 4 },
      comment: "Fabrika has an incredible vibe. A must-visit place in Tbilisi. So many cool spots to eat, drink, and just hang out. It can get a bit pricey, but the experience is worth it.",
      photos: ["https://picsum.photos/seed/rev3/200/200"],
      createdAt: new Date('2023-12-05T20:00:00Z').toISOString(),
      helpfulVotes: 18,
      notHelpfulVotes: 2,
    }
  ]
};

export const mockListings: Listing[] = [
  // Accommodation
  {
    id: 1,
    category: ListingCategory.Accommodation,
    title: "Cozy Studio in Saburtalo",
    description: "A small but comfortable studio apartment near the Technical University metro station. Perfect for a single student.",
    price: "800 GEL/month",
    imageUrl: "https://picsum.photos/seed/acc1/600/400",
    location: "Saburtalo, Tbilisi",
    author: "Nino K.",
    reviews: mockReviews[1] || [],
  },
  {
    id: 2,
    category: ListingCategory.Accommodation,
    title: "Shared Room in Vake",
    description: "Looking for a female roommate to share a spacious room in a 3-bedroom apartment. Close to Vake Park and Ilia State University.",
    price: "500 GEL/month",
    imageUrl: "https://picsum.photos/seed/acc2/600/400",
    location: "Vake, Tbilisi",
    author: "Mariam L.",
    reviews: [],
  },
  {
    id: 3,
    category: ListingCategory.Accommodation,
    title: "Modern 2-Bedroom Flat",
    description: "Fully furnished modern apartment with two separate bedrooms. Ideal for two friends. Includes central heating and a balcony.",
    price: "1500 GEL/month",
    imageUrl: "https://picsum.photos/seed/acc3/600/400",
    location: "Gldani, Tbilisi",
    author: "Giorgi B.",
    reviews: [],
  },
  // Marketplace
  {
    id: 4,
    category: ListingCategory.Marketplace,
    title: "Used MacBook Air M1",
    description: "Selling my 2020 MacBook Air M1. 8GB RAM, 256GB SSD. In great condition, comes with the original charger.",
    price: "1800 GEL",
    imageUrl: "https://picsum.photos/seed/mkt1/600/400",
    location: "Tbilisi",
    author: "Luka T.",
    reviews: mockReviews[4] || [],
  },
  {
    id: 5,
    category: ListingCategory.Marketplace,
    title: "IKEA Study Desk",
    description: "White study desk, almost new. Dimensions: 120cm x 60cm. Perfect for a student room.",
    price: "100 GEL",
    imageUrl: "https://picsum.photos/seed/mkt2/600/400",
    location: "Kutaisi",
    author: "Ana S.",
    reviews: [],
  },
  {
    id: 6,
    category: ListingCategory.Marketplace,
    title: "Electric Guitar Set",
    description: "Beginner electric guitar with a small amplifier and cable. Barely used.",
    price: "350 GEL",
    imageUrl: "https://picsum.photos/seed/mkt3/600/400",
    location: "Batumi",
    author: "Davit M.",
    reviews: [],
  },
  // Explore
  {
    id: 7,
    category: ListingCategory.Explore,
    title: "Fabrika",
    description: "A multi-functional urban space with various cafes and bars. Great for hanging out with friends.",
    rating: 4.8,
    imageUrl: "https://picsum.photos/seed/res1/600/400",
    location: "Marjanishvili, Tbilisi",
    author: "Admin",
    reviews: mockReviews[7] || [],
  },
  {
    id: 8,
    category: ListingCategory.Explore,
    title: "Entrecôte",
    description: "Affordable and delicious Georgian food. Known for its Khinkali and Mtsvadi. Student discount available.",
    rating: 4.5,
    imageUrl: "https://picsum.photos/seed/res2/600/400",
    location: "Chavchavadze Ave, Tbilisi",
    author: "Admin",
    reviews: [],
  },
  {
    id: 9,
    category: ListingCategory.Explore,
    title: "Coffee LAB",
    description: "Specialty coffee shop with a quiet atmosphere, perfect for studying. Free Wi-Fi and power outlets.",
    rating: 4.9,
    imageUrl: "https://picsum.photos/seed/res3/600/400",
    location: "Kazbegi Ave, Tbilisi",
    author: "Admin",
    reviews: [],
  },
];


export const mockNotifications: Notification[] = [
  {
    id: 'notif1',
    type: NotificationType.NewReview,
    message: 'Alex D. left a 5-star review on your listing "Cozy Studio in Saburtalo".',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    link: '/listing/1',
  },
  {
    id: 'notif2',
    type: NotificationType.ListingApproved,
    message: 'Congratulations! Your listing "IKEA Study Desk" has been approved and is now public.',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    link: '/listing/5',
  },
  {
    id: 'notif3',
    type: NotificationType.NewMessage,
    message: 'You have a new message from Sophie B. regarding your ad.',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    link: '/messages/convo2',
  },
  {
    id: 'notif4',
    type: NotificationType.System,
    message: 'Welcome to Yalla.ge! We are happy to have you on board.',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
];


// Mock data for Messaging System
export const mockUsers: { [id: string]: Omit<User, 'email' | 'verified'> } = {
  'user1': { id: 'user1', name: 'Nino K.', picture: 'https://i.pravatar.cc/150?u=nino' },
  'user2': { id: 'user2', name: 'Sophie B.', picture: 'https://i.pravatar.cc/150?u=sophie' },
  'user3': { id: 'user3', name: 'Luka T.', picture: 'https://i.pravatar.cc/150?u=luka' },
};

export const mockMessages: { [conversationId: string]: Message[] } = {
  'convo1': [
    { id: 'msg1', conversationId: 'convo1', senderId: 'user1', text: 'Hi there! Is your studio still available?', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), read: true },
    { id: 'msg2', conversationId: 'convo1', senderId: 'currentUser', text: 'Hey Nino! Yes, it is. Are you interested?', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), read: true },
  ],
  'convo2': [
    { id: 'msg3', conversationId: 'convo2', senderId: 'user2', text: 'Hello! I saw your review on the Saburtalo studio. Was it noisy?', createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), read: true },
    { id: 'msg4', conversationId: 'convo2', senderId: 'currentUser', text: 'Hi Sophie. Not at all, it was quite peaceful actually.', createdAt: new Date(Date.now() - 1000 * 60 * 28).toISOString(), read: true },
    { id: 'msg5', conversationId: 'convo2', senderId: 'user2', text: 'Great, thanks for the info!', createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), read: false },
  ],
  'convo3': [
     { id: 'msg6', conversationId: 'convo3', senderId: 'user3', text: 'Is the price for the MacBook negotiable?', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), read: true },
  ]
};


export const mockConversations: Conversation[] = [
  { id: 'convo1', participantIds: ['currentUser', 'user1'], lastMessage: mockMessages['convo1'][1], unreadCount: 0 },
  { id: 'convo2', participantIds: ['currentUser', 'user2'], lastMessage: mockMessages['convo2'][2], unreadCount: 1 },
  { id: 'convo3', participantIds: ['currentUser', 'user3'], lastMessage: mockMessages['convo3'][0], unreadCount: 0 },
];
