
import React from 'react';
import { GoogleIcon } from './icons';

interface GoogleLoginButtonProps {
    onClick: () => void;
    text: string;
    disabled?: boolean;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onClick, text, disabled = false }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
            <GoogleIcon className="h-6 w-6" />
            <span>{text}</span>
        </button>
    );
};

export default GoogleLoginButton;
