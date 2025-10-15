
import React from 'react';
import { Link } from 'react-router-dom';
import { Listing, ListingCategory } from '../types';

interface ListingCardProps {
  listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const { id, category, title, description, price, imageUrl, location, author } = listing;

  const getAverageRating = () => {
    if (!listing.reviews || listing.reviews.length === 0) {
      // For Explore items without reviews, fallback to the hardcoded rating
      return category === ListingCategory.Explore ? listing.rating : null;
    }
    const total = listing.reviews.reduce((acc, review) => acc + review.rating.overall, 0);
    return total / listing.reviews.length;
  };

  const averageRating = getAverageRating();
  const reviewCount = listing.reviews?.length || 0;

  const renderPriceOrRating = () => {
    if (averageRating) {
      return (
        <div className="flex items-center">
          <i className="fas fa-star text-yellow-400 mr-1"></i>
          <span className="font-bold text-gray-800 dark:text-gray-200">{averageRating.toFixed(1)}</span>
          {reviewCount > 0 && (
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({reviewCount})</span>
          )}
        </div>
      );
    }
    if (price) {
      return <div className="text-lg font-bold text-sky-600 dark:text-sky-400">{price}</div>;
    }
    return null;
  };

  return (
    <Link to={`/listing/${id}`} className="block group h-full">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
        <div className="relative h-48 w-full">
          <img className="h-full w-full object-cover" src={imageUrl} alt={title} />
          <div className="absolute top-2 left-2 bg-sky-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {category}
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1 pr-2">{title}</h3>
            {renderPriceOrRating()}
          </div>

          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
            <i className="fas fa-map-marker-alt mr-2"></i>
            <span>{location}</span>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-2">{description}</p>
          
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
             <div className="text-xs text-gray-500 dark:text-gray-400">
               Posted by <span className="font-medium">{author}</span>
             </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
