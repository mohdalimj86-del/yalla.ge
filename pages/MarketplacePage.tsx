import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLocalization } from '../hooks/useLocalization';
import { useListings } from '../hooks/useListings';
import { useAuth } from '../hooks/useAuth';
import { Listing, ListingCategory } from '../types';
import ListingCard from '../components/ListingCard';

const MarketplacePage: React.FC = () => {
  const { t } = useLocalization();
  const { listings } = useListings();
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  const marketplaceListings = useMemo(() => 
    listings.filter(listing => 
      listing.category === ListingCategory.Marketplace &&
      listing.status !== 'pending' &&
      (listing.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
       listing.description.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [listings, searchTerm]
  );


  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{t('marketplace.title')}</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{t('marketplace.subtitle')}</p>
      </div>
        <div className="mb-8 flex flex-col md:flex-row items-center justify-center gap-4">
         <div className="relative flex-grow max-w-lg w-full">
             <input
                 type="text"
                 placeholder={t('search.placeholder')}
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
             />
             <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
         </div>
         {isAuthenticated && (
            <Link 
                to="/add-listing/marketplace"
                className="px-6 py-3 bg-sky-600 text-white font-semibold rounded-full transition-colors hover:bg-sky-700 whitespace-nowrap"
            >
              <i className="fas fa-plus mr-2"></i>
              {t('nav.add_marketplace')}
            </Link>
         )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {marketplaceListings.map((listing: Listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
};

export default MarketplacePage;