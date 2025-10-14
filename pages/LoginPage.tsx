import React, { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
import { User } from '../types';
import { GoogleIcon } from '../components/icons';

const LoginPage: React.FC = () => {
    const { login, isAuthenticated } = useAuth();
    const { t } = useLocalization();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/profile', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const processLogin = (user: User, isNew: boolean = false) => {
        const welcomeShown = localStorage.getItem(`welcome_shown_${user.id}`);
        login(user, isNew || !welcomeShown);
    };

   const handleGoogleSignIn = async () => {
  try {
    await signIn('google', { callbackUrl: '/profile' });
  } catch (error) {
    console.error('Google login failed:', error);
    setError('Google login failed. Please try again.');
  }
};

    return (
        <div className="flex items-center justify-center py-12">
            <div className="w-full max-w-sm p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {t('login.title')}
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        {t('login.subtitle')}
                    </p>
                </div>
                
                <div>
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
                    >
                        <GoogleIcon className="h-6 w-6" />
                        <span>{t('login.google')}</span>
                    </button>
                </div>

                {error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}
            </div>
        </div>
    );
};

export default LoginPage;