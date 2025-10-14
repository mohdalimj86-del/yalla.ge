import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Listing } from '../types';
import { mockListings } from '../data/mockData';

interface ListingContextType {
  listings: Listing[];
  // FIX: Updated function signature to accept authorName, matching the implementation and usage.
  addListing: (newListing: Omit<Listing, 'id' | 'author'>, authorName: string) => void;
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

  // FIX: Corrected the type of `listingData` to Omit<Listing, 'id' | 'author'> to match the data passed from the form.
  const addListing = useCallback((listingData: Omit<Listing, 'id' | 'author'>, authorName: string) => {
    setListings(currentListings => {
      const newListing: Listing = {
        ...listingData,
        id: Date.now(), // Simple unique ID
        author: authorName,
      };
      const updatedListings = [newListing, ...currentListings];
      
      // Save only user-created listings to local storage
      const userListings = updatedListings.filter(l => !mockListings.some(ml => ml.id === l.id));
      localStorage.setItem(USER_LISTINGS_STORAGE_KEY, JSON.stringify(userListings));

      return updatedListings;
    });
  }, []);


  return (
    <ListingContext.Provider value={{ listings, addListing }}>
      {children}
    </ListingContext.Provider>
  );
};