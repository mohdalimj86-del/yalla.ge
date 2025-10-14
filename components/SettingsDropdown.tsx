import React, { useState, useRef, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { LANGUAGE_OPTIONS } from '../constants';

const SettingsDropdown: React.FC = () => {
  const { language, setLanguage } = useLocalization();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="Settings"
        type="button"
      >
        <i className="fas fa-cog text-lg"></i>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-20 py-2 ring-1 ring-black ring-opacity-5">
          <div className="px-3 py-2">
            <h4 className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 mb-2">Language</h4>
             {LANGUAGE_OPTIONS.map(option => (
                <button
                key={option.code}
                onClick={() => {
                    setLanguage(option.code);
                    setIsOpen(false);
                }}
                className={`w-full text-left flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    language === option.code
                    ? 'bg-sky-50 text-sky-700 dark:bg-sky-800/50 dark:text-sky-200'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                type="button"
                >
                <span className="mr-3 text-lg w-6 text-center">{option.flag}</span>
                <span>{option.name}</span>
                </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown;