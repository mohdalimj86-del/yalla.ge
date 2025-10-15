
import React from 'react';
import { Review } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import StarRating from './StarRating';

interface RatingSummaryProps {
    reviews: Review[];
    averageRating: number;
}

const RatingSummary: React.FC<RatingSummaryProps> = ({ reviews, averageRating }) => {
    const { t } = useLocalization();
    const totalReviews = reviews.length;

    const ratingDistribution = [5, 4, 3, 2, 1].map(stars => {
        const count = reviews.filter(r => r.rating.overall === stars).length;
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
        return { stars, count, percentage };
    });

    return (
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('reviews.average_rating')}</h3>
            <div className="flex items-center space-x-4 mb-4">
                <div className="text-5xl font-extrabold text-gray-800 dark:text-gray-200">{averageRating.toFixed(1)}</div>
                <div>
                    <StarRating rating={averageRating} readOnly size="lg" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>
            
            <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3">{t('reviews.rating_distribution')}</h4>
            <div className="space-y-2">
                {ratingDistribution.map(({ stars, count, percentage }) => (
                    <div key={stars} className="flex items-center gap-2 text-sm">
                        <div className="flex items-center w-12 text-gray-600 dark:text-gray-300">
                            {stars} <i className="fas fa-star text-yellow-400 ml-1 text-xs"></i>
                        </div>
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <div className="w-8 text-right text-gray-500 dark:text-gray-400">{count}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RatingSummary;
