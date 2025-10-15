
import React, { useEffect, useState } from 'react';
import { useGoogleLogin, TokenResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
import { User, Badge } from '../types';
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

    const handleGoogleLoginSuccess = (tokenResponse: Omit<TokenResponse, 'error' | 'error_description' | 'error_uri'>) => {
        // In a real app, you'd send the access token to your backend.
        // Here, we fetch user info directly from Google to create a mock user session.
        fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`, {
            headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
                Accept: 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                throw new Error(data.error.message);
            }
            const isNew = !localStorage.getItem(`welcome_shown_${data.id}`);
            const mockUser: User = {
                id: data.id,
                name: data.name,
                email: data.email,
                picture: data.picture,
                verified: true, // Assume Google verification is enough
                reviewCount: 0,
                badges: [Badge.NewUser]
            };
            processLogin(mockUser, isNew);
        })
        .catch(err => {
            console.error('Failed to fetch user info from Google:', err);
            setError(t('login.error.google'));
        });
    };

    const googleLogin = useGoogleLogin({
        onSuccess: handleGoogleLoginSuccess,
        onError: () => setError(t('login.error.google')),
    });

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
                        onClick={() => googleLogin()}
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
