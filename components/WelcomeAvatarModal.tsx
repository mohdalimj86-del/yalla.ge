import React, { useEffect, useState, useRef } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { CloseIcon } from './icons';

interface WelcomeAvatarModalProps {
    isOpen: boolean;
    onClose: () => void;
    userName: string;
}

const SpeakingAvatar: React.FC<{ isSpeaking: boolean }> = ({ isSpeaking }) => (
    <div className={`relative w-28 h-28 mx-auto transition-transform duration-300 ${isSpeaking ? 'scale-105' : 'scale-100'}`}>
         <svg viewBox="0 0 120 120" className="w-full h-full">
            <defs>
                <clipPath id="avatar-clip">
                    <circle cx="60" cy="60" r="50" />
                </clipPath>
            </defs>
            {/* Shadow */}
            <circle cx="60" cy="65" r="50" fill="rgba(0,0,0,0.1)" />
            {/* Base */}
            <circle cx="60" cy="60" r="50" fill="rgb(34 197 94)" />
            {/* Speaking animation circle */}
            {isSpeaking && <circle cx="60" cy="60" r="50" fill="white" className="opacity-20 animate-pulse" />}
            {/* Face features */}
            <g clipPath="url(#avatar-clip)">
                <circle cx="45" cy="50" r="5" fill="white" />
                <circle cx="75" cy="50" r="5" fill="white" />
                <path 
                    d="M 40 75 Q 60 90 80 75" 
                    stroke="white" 
                    strokeWidth={isSpeaking ? 6 : 4} 
                    fill="none" 
                    strokeLinecap="round" 
                    className="transition-all"
                />
            </g>
        </svg>
    </div>
);

const WelcomeAvatarModal: React.FC<WelcomeAvatarModalProps> = ({ isOpen, onClose, userName }) => {
    const { t } = useLocalization();
    const [isSpeaking, setIsSpeaking] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // The welcome message is now silent.
        // This effect simulates the speaking animation for a short duration when the modal opens.
        let animationTimer: ReturnType<typeof setTimeout>;
        let speakingDurationTimer: ReturnType<typeof setTimeout>;

        if (isOpen) {
            // Start animation after a short delay to coincide with modal opening animation
            animationTimer = setTimeout(() => {
                setIsSpeaking(true);
                // Stop the animation after a few seconds
                speakingDurationTimer = setTimeout(() => setIsSpeaking(false), 5000); 
            }, 300);
        } else {
            setIsSpeaking(false);
        }

        return () => {
            clearTimeout(animationTimer);
            clearTimeout(speakingDurationTimer);
            setIsSpeaking(false);
        };
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-modal-title"
        >
            <div 
                ref={modalRef} 
                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8 text-center transform transition-all animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    aria-label="Close modal"
                >
                    <CloseIcon className="h-6 w-6" />
                </button>
                
                <SpeakingAvatar isSpeaking={isSpeaking} />

                <h2 id="welcome-modal-title" className="text-2xl font-bold text-gray-900 dark:text-white mt-6">{t('welcome.title')}</h2>
                
                <div className="mt-4 space-y-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    <p className="font-semibold">{t('welcome.greeting').replace('{userName}', userName)}</p>
                    <p>{t('welcome.intro')}</p>
                    <p>{t('welcome.body')}</p>
                    <div className="pt-2">
                        <p className="font-semibold">{t('welcome.help_title')}</p>
                        <p>{t('welcome.help_body')}</p>
                    </div>
                    <p className="pt-2">{t('welcome.closing')}</p>
                </div>

                <div className="mt-8">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-300 dark:focus:ring-sky-800 transition-all duration-300 transform hover:scale-105"
                    >
                        {t('welcome.button.start')}
                    </button>
                </div>
            </div>
             <style>{`
                @keyframes fade-in-up {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.4s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default WelcomeAvatarModal;