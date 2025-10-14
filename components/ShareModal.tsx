import React, { useEffect, useRef, useState } from 'react';
import { CloseIcon } from './icons';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    listingUrl: string;
    listingTitle: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, listingUrl, listingTitle }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    useEffect(() => {
      if (isOpen) {
        setCopied(false);
      }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(listingUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        });
    };
    
    // Social share links
    const encodedUrl = encodeURIComponent(listingUrl);
    const encodedTitle = encodeURIComponent(listingTitle);
    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
        telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
            <div ref={modalRef} className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    aria-label="Close modal"
                >
                    <CloseIcon className="h-6 w-6" />
                </button>
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Share Listing</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Share this link via</p>
                <div className="mt-4 flex justify-around">
                    <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-3xl hover:opacity-80"><i className="fab fa-facebook-square"></i></a>
                    <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-sky-500 text-3xl hover:opacity-80"><i className="fab fa-twitter-square"></i></a>
                    <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="text-green-500 text-3xl hover:opacity-80"><i className="fab fa-whatsapp-square"></i></a>
                    <a href={shareLinks.telegram} target="_blank" rel="noopener noreferrer" className="text-sky-400 text-3xl hover:opacity-80"><i className="fab fa-telegram"></i></a>
                </div>

                <div className="mt-6">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Or copy link</p>
                    <div className="mt-2 flex rounded-md shadow-sm">
                        <input
                            type="text"
                            readOnly
                            value={listingUrl}
                            className="block w-full rounded-none rounded-l-md border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 px-3 py-2 text-sm"
                        />
                        <button
                            onClick={handleCopy}
                            type="button"
                            className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-500"
                        >
                            <i className={`fas ${copied ? 'fa-check text-green-500' : 'fa-copy'}`}></i>
                            <span>{copied ? 'Copied!' : 'Copy'}</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ShareModal;
