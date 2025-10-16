import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useListings } from '../hooks/useListings';
import { useLocalization } from '../hooks/useLocalization';
import { Listing } from '../types';
import ConfirmationModal from './ConfirmationModal';

const MyListings: React.FC = () => {
    const { user } = useAuth();
    const { listings, deleteListing } = useListings();
    const { t } = useLocalization();
    
    const [listingToDelete, setListingToDelete] = useState<Listing | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const myListings = useMemo(() => {
        if (!user) return [];
        // Filter listings where author matches current user's name. 
        // In a real app, this would be a user ID comparison.
        return listings.filter(listing => listing.author === user.name);
    }, [listings, user]);

    const handleDeleteClick = (listing: Listing) => {
        setListingToDelete(listing);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (listingToDelete) {
            deleteListing(listingToDelete.id);
        }
        setIsConfirmModalOpen(false);
        setListingToDelete(null);
    };

    return (
        <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('profile.my_listings')}</h3>
            {myListings.length === 0 ? (
                <div className="text-center py-8 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-400">{t('profile.no_listings')}</p>
                    <Link to="/add-listing/accommodation" className="mt-4 inline-block text-sky-600 dark:text-sky-400 font-semibold hover:underline">
                        {t('profile.create_first_listing')}
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {myListings.map(listing => (
                        <div key={listing.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg shadow-sm flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 overflow-hidden">
                               <img src={listing.imageUrl} alt={listing.title} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                               <div className="overflow-hidden">
                                   <Link to={`/listing/${listing.id}`} className="font-semibold text-gray-800 dark:text-gray-200 hover:underline truncate block">
                                       {listing.title}
                                   </Link>
                                   <p className="text-sm text-gray-500 dark:text-gray-400">{listing.location}</p>
                               </div>
                            </div>
                            <div className="flex-shrink-0">
                                <button 
                                    onClick={() => handleDeleteClick(listing)}
                                    className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-100 dark:bg-red-900/50 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900 transition-colors"
                                    aria-label={`${t('delete.listing.button.delete')} ${listing.title}`}
                                >
                                    <i className="fas fa-trash-alt mr-1.5"></i>
                                    {t('delete.listing.button.delete')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title={t('delete.listing.title')}
                message={t('delete.listing.message').replace('{listingTitle}', listingToDelete?.title || '')}
            />
        </div>
    );
};

export default MyListings;