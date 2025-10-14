import React from 'react';
import { Link } from 'react-router-dom';
import { useLocalization } from '../hooks/useLocalization';
import { YallaIcon } from './icons';

const Footer: React.FC = () => {
  const { t } = useLocalization();

  return (
    <footer className="bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <YallaIcon className="h-7 w-auto text-sky-600" />
            <span className="font-bold text-lg text-gray-700 dark:text-gray-300">{t('app.title')}</span>
          </div>
          <div className="flex space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
            <Link to="/about" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">{t('footer.about')}</Link>
            <Link to="/contact" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">{t('footer.contact')}</Link>
            <Link to="/terms" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">{t('footer.terms')}</Link>
            <Link to="/privacy" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">{t('footer.privacy')}</Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;