
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Listing, Review } from '../types';
import { mockListings } from '../data/mockData';

interface ListingContextType {
  listings: Listing[];
  addListing: (newListing: Omit<Listing, 'id' | 'author' | 'reviews'>, authorName: string) => void;
  addReview: (listingId: number, reviewData: Omit<Review, 'id' | 'listingId'>) => void;
  deleteListing: (listingId: number) => void;
}

export const ListingContext = createContext<ListingContextType | undefined>(undefined);

const USER_LISTINGS_STORAGE_KEY = 'userListings';

export const ListingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    try {
      const storedUserListings = localStorage.getItem(USER_LISTINGS_STORAGE_KEY);
      const userListings = storedUserListings ? JSON.parse(storedUserListings) : [];
      // Combine mock listings with user-created listings, showing user's first
      setListings([...userListings, ...mockListings]);
    } catch (error) {
      console.error("Failed to parse user listings from local storage", error);
      setListings(mockListings);
    }
  }, []);

  const addListing = useCallback((listingData: Omit<Listing, 'id' | 'author' | 'reviews'>, authorName: string) => {
    setListings(currentListings => {
      const newListing: Listing = {
        ...listingData,
        id: Date.now(), // Simple unique ID
        author: authorName,
        reviews: [],
      };
      const updatedListings = [newListing, ...currentListings];
      
      const userListings = updatedListings.filter(l => !mockListings.some(ml => ml.id === l.id));
      localStorage.setItem(USER_LISTINGS_STORAGE_KEY, JSON.stringify(userListings));

      return updatedListings;
    });
  }, []);

  const addReview = useCallback((listingId: number, reviewData: Omit<Review, 'id' | 'listingId'>) => {
    setListings(currentListings => {
        const newReview: Review = {
            ...reviewData,
            id: Date.now(),
            listingId: listingId,
        };
        
        const updatedListings = currentListings.map(listing => {
            if (listing.id === listingId) {
                return {
                    ...listing,
                    reviews: [newReview, ...(listing.reviews || [])],
                };
            }
            return listing;
        });

        // For user-created listings, we update local storage to persist the new review.
        // For mock listings, the review is only kept in state and will reset on refresh.
        try {
            const storedUserListings = localStorage.getItem(USER_LISTINGS_STORAGE_KEY);
            const userListings = storedUserListings ? JSON.parse(storedUserListings) : [];
            const isUserListing = userListings.some((l: Listing) => l.id === listingId);

            if (isUserListing) {
                const updatedUserListings = userListings.map((l: Listing) => {
                    if (l.id === listingId) {
                        return { ...l, reviews: [newReview, ...(l.reviews || [])] };
                    }
                    return l;
                });
                localStorage.setItem(USER_LISTINGS_STORAGE_KEY, JSON.stringify(updatedUserListings));
            }
        } catch (error) {
            console.error("Failed to update user listings in local storage", error);
        }

        return updatedListings;
    });
  }, []);

  const deleteListing = useCallback((listingId: number) => {
    setListings(currentListings => {
        const updatedListings = currentListings.filter(listing => listing.id !== listingId);
        
        // Update local storage for user-created listings
        const userListings = updatedListings.filter(l => !mockListings.some(ml => ml.id === l.id));
        localStorage.setItem(USER_LISTINGS_STORAGE_KEY, JSON.stringify(userListings));
        
        return updatedListings;
    });
  }, []);


  return (
    <ListingContext.Provider value={{ listings, addListing, addReview, deleteListing }}>
      {children}
    </ListingContext.Provider>
  );
};