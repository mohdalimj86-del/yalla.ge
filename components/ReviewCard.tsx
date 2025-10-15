
import React, { useState } from 'react';
import { Review, Badge } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import StarRating from './StarRating';

interface ReviewCardProps {
    review: Review;
}

const BadgeDisplay: React.FC<{ badge: Badge }> = ({ badge }) => {
    const { t } = useLocalization();
    const badgeKey = `badge.${badge.replace(/\s/g, '')}` as any;
    const badgeStyles: { [key in Badge]: { icon: string, color: string } } = {
        [Badge.VerifiedReviewer]: { icon: 'fa-check-circle', color: 'text-blue-500' },
        [Badge.TopContributor]: { icon: 'fa-award', color: 'text-amber-500' },
        [Badge.NewUser]: { icon: 'fa-leaf', color: 'text-green-500' },
    };

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 ${badgeStyles[badge]?.color}`}>
            <i className={`fas ${badgeStyles[badge]?.icon} mr-1.5`}></i>
            {t(badgeKey)}
        </span>
    );
};

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
    const { t } = useLocalization();
    const [isExpanded, setIsExpanded] = useState(false);
    const [helpfulVotes, setHelpfulVotes] = useState(review.helpfulVotes);
    const [notHelpfulVotes, setNotHelpfulVotes] = useState(review.notHelpfulVotes);

    const commentNeedsTruncation = review.comment.length > 200;
    const displayComment = commentNeedsTruncation && !isExpanded 
        ? `${review.comment.substring(0, 200)}...` 
        : review.comment;

    const formattedDate = new Date(review.createdAt).toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="py-6">
            <div className="flex items-start space-x-4">
                <img 
                    className="h-12 w-12 rounded-full object-cover" 
                    src={review.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.authorName)}&background=random`} 
                    alt={review.authorName} 
                />
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{review.authorName}</p>
                            <div className="flex items-center gap-2 mt-1">
                                {review.authorBadges?.map(badge => <BadgeDisplay key={badge} badge={badge} />)}
                            </div>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</div>
                    </div>
                    <div className="my-2">
                        <StarRating rating={review.rating.overall} readOnly size="sm" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{displayComment}</p>
                    {commentNeedsTruncation && (
                        <button 
                            onClick={() => setIsExpanded(!isExpanded)} 
                            className="text-sky-600 dark:text-sky-400 hover:underline text-sm mt-1"
                        >
                            {isExpanded ? t('review.show_less') : t('review.show_more')}
                        </button>
                    )}

                    {review.photos.length > 0 && (
                        <div className="mt-4 flex space-x-2">
                            {review.photos.map((photo, index) => (
                                <a key={index} href={photo} target="_blank" rel="noopener noreferrer">
                                    <img src={photo} alt={`Review photo ${index + 1}`} className="h-20 w-20 object-cover rounded-md hover:opacity-80 transition-opacity" />
                                </a>
                            ))}
                        </div>
                    )}

                    <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>Was this review helpful?</span>
                        <button onClick={() => setHelpfulVotes(v => v + 1)} className="group flex items-center space-x-1 hover:text-sky-600 dark:hover:text-sky-400">
                            <i className="fas fa-thumbs-up group-hover:animate-pulse"></i>
                            <span>{t('review.helpful')} ({helpfulVotes})</span>
                        </button>
                        <button onClick={() => setNotHelpfulVotes(v => v + 1)} className="group flex items-center space-x-1 hover:text-red-600 dark:hover:text-red-400">
                            <i className="fas fa-thumbs-down"></i>
                            <span>{t('review.not_helpful')} ({notHelpfulVotes})</span>
                        </button>
                    </div>

                    {review.reply && (
                        <div className="mt-4 ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                            <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{t('review.reply_from').replace('{authorName}', review.reply.authorName)}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{review.reply.comment}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;
