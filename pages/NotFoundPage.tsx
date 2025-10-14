import React from 'react';
import { Link } from 'react-router-dom';
import { useLocalization } from '../hooks/useLocalization';

const NotFoundPage: React.FC = () => {
    const { t } = useLocalization();

    return (
        <div className="flex flex-col items-center justify-center text-center h-full py-20">
            <h1 className="text-9xl font-extrabold text-sky-600 dark:text-sky-500 tracking-widest">404</h1>
            <div className="bg-gray-800 text-white px-4 text-2xl rounded rotate-12 absolute dark:bg-gray-700">
                {t('notfound.title')}
            </div>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                {t('notfound.description')}
            </p>
            <Link 
                to="/" 
                className="mt-8 inline-block rounded-lg bg-sky-600 px-6 py-3 text-base font-medium text-white hover:bg-sky-700 transition-colors"
            >
                {t('notfound.gohome')}
            </Link>
        </div>
    );
};

export default NotFoundPage;