import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useListings } from '../hooks/useListings';
import { useLocalization } from '../hooks/useLocalization';
import ListingCard from '../components/ListingCard';
import { Listing } from '../types';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { listings } = useListings();
  const { t } = useLocalization();
  const query = searchParams.get('q') || '';

  const filteredListings: Listing[] = useMemo(() => {
    if (!query.trim()) {
      return [];
    }
    const lowercasedQuery = query.trim().toLowerCase();
    return listings.filter(
      (listing) =>
        listing.status !== 'pending' &&
        (listing.title.toLowerCase().includes(lowercasedQuery) ||
        listing.description.toLowerCase().includes(lowercasedQuery) ||
        listing.location.toLowerCase().includes(lowercasedQuery) ||
        listing.category.toLowerCase().includes(lowercasedQuery))
    );
  }, [listings, query]);

  return (
    <div>
      <div className="text-center mb-12">
        {query ? (
          <>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('search.results_for')}{' '}
              <span className="text-sky-600 dark:text-sky-400">"{query}"</span>
            </h1>
            {filteredListings.length === 0 && (
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                    {t('search.no_results')}{' '}
                    <span className="font-semibold">"{query}"</span>
                </p>
            )}
          </>
        ) : (
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('search.enter_term')}</h1>
        )}
      </div>

      {filteredListings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;