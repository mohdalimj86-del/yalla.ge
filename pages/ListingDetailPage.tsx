

import React, { useMemo, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useListings } from '../hooks/useListings';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
import { Listing, ListingCategory, RatingDetails, Review, Badge } from '../types';
import RatingSummary from '../components/RatingSummary';
import ReviewCard from '../components/ReviewCard';
import StarRating from '../components/StarRating';
import ShareModal from '../components/ShareModal';

const ReviewForm: React.FC<{ listing: Listing }> = ({ listing }) => {
    const { t } = useLocalization();
    const { user } = useAuth();
    const { addReview } = useListings();

    const [rating, setRating] = useState<RatingDetails>({ overall: 0 });
    const [comment, setComment] = useState('');
    const [photos, setPhotos] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [photoError, setPhotoError] = useState('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (photos.length + files.length > 4) {
            setPhotoError(t('review.form.error.max_photos'));
            return;
        }
        setPhotoError('');
        files.forEach(file => {
            if (file instanceof Blob) {
                const reader = new FileReader();
                reader.onload = () => {
                    setPhotos(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            }
        });
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating.overall === 0 || !comment.trim()) {
            setError(t('review.form.error.all_fields'));
            return;
        }

        if (user) {
            const newReview: Omit<Review, 'id' | 'listingId'> = {
                authorId: user.id,
                authorName: user.name,
                authorAvatar: user.avatarUrl || user.picture,
                authorBadges: user.badges || [Badge.NewUser],
                rating,
                comment,
                photos,
                createdAt: new Date().toISOString(),
                helpfulVotes: 0,
                notHelpfulVotes: 0,
            };
            addReview(listing.id, newReview);
            // Reset form
            setRating({ overall: 0 });
            setComment('');
            setPhotos([]);
            setError('');
            setPhotoError('');
        }
    };
    
    const categorySpecificRatings = () => {
        switch (listing.category) {
            case ListingCategory.Accommodation:
                return ['accuracy', 'communication', 'value'];
            case ListingCategory.Marketplace:
                return ['accuracy', 'value'];
            case ListingCategory.Explore:
                return ['service', 'value'];
            default:
                return [];
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('reviews.leave_a_review')}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center space-x-4">
                    <span className="font-semibold">{t('review.form.overall_rating')}:</span>
                    <StarRating rating={rating.overall} setRating={(r) => setRating(prev => ({ ...prev, overall: r }))} />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                    {categorySpecificRatings().map(cat => (
                         <div key={cat} className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t(`review.form.category_rating.${cat}` as any)}</span>
                            <StarRating rating={rating[cat as keyof RatingDetails] as number || 0} setRating={(r) => setRating(prev => ({ ...prev, [cat]: r }))} size="sm" />
                        </div>
                    ))}
                </div>

                <div>
                    <textarea 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={t('review.form.comment_placeholder')}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600"
                        rows={4}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('review.form.add_photos')} (Max 4)</label>
                    <input type="file" multiple onChange={handleFileChange} accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 dark:file:bg-sky-900/50 dark:file:text-sky-300 dark:hover:file:bg-sky-900" />
                    {photoError && <p className="text-sm text-red-500 mt-1">{photoError}</p>}
                    <div className="mt-2 flex space-x-2">
                        {photos.map((photo, index) => (
                            <img key={index} src={photo} className="h-16 w-16 object-cover rounded" alt="upload preview"/>
                        ))}
                    </div>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button type="submit" className="w-full px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg transition-colors hover:bg-sky-700">
                    {t('review.form.submit')}
                </button>
            </form>
        </div>
    );
};

const ListingDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { listings } = useListings();
    const { isAuthenticated } = useAuth();
    const { t } = useLocalization();
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const listing = useMemo(() => listings.find(l => l.id === Number(id)), [id, listings]);

    if (!listing) {
        return <Navigate to="/404" replace />;
    }
    
    const reviews = listing.reviews || [];

    const averageRating = useMemo(() => {
        if (reviews.length === 0) {
            return listing.category === ListingCategory.Explore ? (listing.rating || 0) : 0;
        }
        const total = reviews.reduce((acc, review) => acc + review.rating.overall, 0);
        return total / reviews.length;
    }, [reviews, listing.category, listing.rating]);

    const listingUrl = window.location.href;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <img src={listing.imageUrl} alt={listing.title} className="w-full h-64 md:h-96 object-cover" />
                <div className="p-6 md:p-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-sky-600 dark:text-sky-400 uppercase">{listing.category}</p>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-1">{listing.title}</h1>
                            <div className="flex items-center text-gray-500 dark:text-gray-400 mt-2">
                                <i className="fas fa-map-marker-alt mr-2"></i>
                                <span>{listing.location}</span>
                            </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                           {listing.price && <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">{listing.price}</p>}
                           <button onClick={() => setIsShareModalOpen(true)} className="mt-2 text-gray-500 hover:text-sky-600 dark:text-gray-400 dark:hover:text-sky-400 transition-colors" title="Share listing">
                               <i className="fas fa-share-alt mr-2"></i> Share
                           </button>
                        </div>
                    </div>
                    
                    <p className="mt-6 text-gray-700 dark:text-gray-300">{listing.description}</p>

                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                        {t('listing.details.posted_by')} <span className="font-semibold text-gray-800 dark:text-gray-200">{listing.author}</span>
                    </div>
                </div>
            </div>

            <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('reviews.title')}</h2>
                {reviews.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                            <RatingSummary reviews={reviews} averageRating={averageRating} />
                        </div>
                        <div className="lg:col-span-2 divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                            {reviews.map(review => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 px-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-gray-600 dark:text-gray-400">{t('reviews.no_reviews')}</p>
                    </div>
                )}
            </div>
            
            {isAuthenticated ? (
                <ReviewForm listing={listing} />
            ) : (
                <div className="mt-8 text-center p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p>{t('reviews.login_to_review')} <Link to="/login" className="text-sky-600 dark:text-sky-400 font-semibold hover:underline">Log in</Link></p>
                </div>
            )}
             <ShareModal 
                isOpen={isShareModalOpen} 
                onClose={() => setIsShareModalOpen(false)} 
                listingUrl={listingUrl}
                listingTitle={listing.title}
            />
        </div>
    );
};

export default ListingDetailPage;