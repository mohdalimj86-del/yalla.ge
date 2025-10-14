import { useContext } from 'react';
import { ListingContext } from '../context/ListingContext';

export const useListings = () => {
  const context = useContext(ListingContext);
  if (context === undefined) {
    throw new Error('useListings must be used within a ListingProvider');
  }
  return context;
};