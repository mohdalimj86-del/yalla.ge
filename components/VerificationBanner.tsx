import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';

const VerificationBanner: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const { t } = useLocalization();

    if (!isAuthenticated || user?.verified || !user.verificationToken) {
        return null;
    }

    return (
        <div className="bg-yellow-100 border-b-2 border-yellow-200 text-yellow-900 p-4 dark:bg-yellow-900/30 dark:border-yellow-800/50 dark:text-yellow-200">
            <div className="container mx-auto flex items-center justify-center text-center">
                <div>
                    <p className="font-bold">{t('verification.banner_title')}</p>
                    <p className="text-sm">
                        {t('verification.banner_text')}{' '}
                        {/* This link simulates the user clicking the link in their email */}
                         <Link to={`/verify-email?token=${user.verificationToken}`} className="font-semibold underline hover:text-yellow-950 dark:hover:text-yellow-100">
                             {t('verification.click_to_verify')}
                         </Link>
                         .
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerificationBanner;