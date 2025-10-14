import React, { useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useLocalization } from '../hooks/useLocalization';
import { useAuth } from '../hooks/useAuth';
import { useListings } from '../hooks/useListings';
import { ListingCategory } from '../types';

const AddListingPage: React.FC = () => {
    const { category } = useParams<{ category: string }>();
    const navigate = useNavigate();
    const { t } = useLocalization();
    const { user, isAuthenticated } = useAuth();
    const { addListing } = useListings();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [error, setError] = useState('');

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const isValidCategory = category === 'accommodation' || category === 'marketplace';
    if (!isValidCategory) {
        return <Navigate to="/404" replace />;
    }

    const listingCategory = category === 'accommodation' ? ListingCategory.Accommodation : ListingCategory.Marketplace;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!title || !description || !price || !location || !image) {
            setError(t('add_listing.error.all_fields'));
            return;
        }

        addListing({
            category: listingCategory,
            title,
            description,
            price,
            location,
            imageUrl: image,
        }, user!.name);

        navigate(`/${category}`);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                {listingCategory === ListingCategory.Accommodation 
                    ? t('add_listing.title.accommodation') 
                    : t('add_listing.title.marketplace')}
            </h1>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('add_listing.field.title')}</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" required />
                    </div>
                     <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('add_listing.field.description')}</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" required />
                    </div>
                     <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('add_listing.field.price')}</label>
                        <input type="text" id="price" value={price} onChange={e => setPrice(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" required />
                    </div>
                     <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('add_listing.field.location')}</label>
                        <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('add_listing.field.image')}</label>
                        <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md dark:border-gray-600">
                            <div className="space-y-1 text-center">
                                <i className="fas fa-image fa-3x text-gray-400"></i>
                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-sky-600 hover:text-sky-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sky-500 dark:bg-gray-800 dark:text-sky-400">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>

                    {image && (
                        <div>
                            <p className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('add_listing.image_preview')}</p>
                            <img src={image} alt="Preview" className="mt-2 rounded-md max-h-60 w-auto mx-auto" />
                        </div>
                    )}
                    
                    {error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}

                    <div>
                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                           {t('add_listing.button.submit')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddListingPage;