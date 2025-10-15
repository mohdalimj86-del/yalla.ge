import React from 'react';
import { FacebookIcon } from './icons';

interface FacebookLoginButtonProps {
    onClick: () => void;
    text: string;
    disabled?: boolean;
    title?: string;
}

const FacebookLoginButton: React.FC<FacebookLoginButtonProps> = ({ onClick, text, disabled = false, title }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            type="button"
            title={title}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#1877F2] text-white rounded-md shadow-sm text-sm font-medium hover:bg-[#166fe5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1877F2] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
            <FacebookIcon className="h-5 w-5" />
            <span>{text}</span>
        </button>
    );
};

export default FacebookLoginButton;