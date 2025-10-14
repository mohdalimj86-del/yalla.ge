import React, { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
import { User } from '../types';
import { GoogleIcon, FacebookIcon } from '../components/icons';

const USERS_STORAGE_KEY = 'yalla_users';

const LoginPage: React.FC = () => {
    const { login, isAuthenticated } = useAuth();
    const { t } = useLocalization();
    const navigate = useNavigate();
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/profile');
        }
    }, [isAuthenticated, navigate]);

    const processLogin = (user: User, isNew: boolean = false) => {
        const welcomeShown = localStorage.getItem(`welcome_shown_${user.id}`);
        login(user, isNew || !welcomeShown);
        navigate('/profile');
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const googleUserInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { 'Authorization': `Bearer ${tokenResponse.access_token}` }
                });
                const googleUser = await googleUserInfoResponse.json();
                const savedAvatar = localStorage.getItem(`avatar_${googleUser.sub}`);
                const user: User = {
                    id: googleUser.sub,
                    name: googleUser.name,
                    email: googleUser.email,
                    picture: googleUser.picture,
                    avatarUrl: savedAvatar || undefined,
                    verified: true,
                };
                processLogin(user);
            } catch (err) {
                console.error("Google login failed", err);
                setError('Google login failed. Please try again.');
            }
        },
        onError: () => {
            console.error('Google login failed');
            setError('Google login failed. Please try again.');
        },
    });

    const handleFacebookLogin = () => {
        console.log("Simulating Facebook Login...");
        const mockFbUser: User = {
            id: `fb-${Date.now()}`,
            name: "Facebook User",
            email: "facebook.user@example.com",
            verified: true,
            picture: `https://ui-avatars.com/api/?name=Facebook+User&background=3b5998&color=fff`,
        };
        processLogin(mockFbUser);
    };

    const handleEmailSignup = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError(t('signup.error.weak_password'));
            return;
        }
        if (password !== confirmPassword) {
            setError(t('signup.error.password_mismatch'));
            return;
        }

        try {
            const storedUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
            const users = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

            if (users.some((u: any) => u.email === email)) {
                setError(t('signup.error.email_exists'));
                return;
            }

            const newUser: User & { password?: string } = {
                id: `email-${Date.now()}`,
                name,
                email,
                verified: false,
                verificationToken: `token-${Math.random().toString(36).substring(2)}`,
                verificationTokenExpires: Date.now() + 3600 * 1000, // Expires in 1 hour
            };
            
            const newUserWithPassword = { ...newUser, password };
            users.push(newUserWithPassword);
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

            delete newUser.password;
            processLogin(newUser, true);

        } catch (err) {
            console.error("Signup failed", err);
            setError(t('signup.error.generic'));
        }
    };
    
    const handleEmailLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const storedUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
            const users = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

            const foundUser = users.find((u: any) => u.email === email && u.password === password);

            if (foundUser) {
                const { password, ...userToLogin } = foundUser;
                processLogin(userToLogin);
            } else {
                setError(t('login.error.credentials'));
            }
        } catch (err) {
             console.error("Login failed", err);
             setError(t('login.error.credentials'));
        }
    };

    const toggleMode = () => {
        setMode(prev => (prev === 'login' ? 'signup' : 'login'));
        setError('');
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="flex items-center justify-center py-12">
            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {mode === 'login' ? t('login.title') : t('signup.title')}
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        {mode === 'login' ? t('login.subtitle') : t('signup.subtitle')}
                    </p>
                </div>
                
                <div className="space-y-4">
                    <button
                        onClick={() => handleGoogleLogin()}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
                    >
                        <GoogleIcon className="h-6 w-6" />
                        <span>{t('login.google')}</span>
                    </button>
                    <button
                        onClick={handleFacebookLogin}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        <FacebookIcon className="h-6 w-6" />
                        <span>{t('login.facebook')}</span>
                    </button>
                </div>

                <div className="flex items-center">
                    <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                    <span className="flex-shrink mx-4 text-sm text-gray-500 dark:text-gray-400">{t('login.or_divider')}</span>
                    <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                </div>

                <form onSubmit={mode === 'login' ? handleEmailLogin : handleEmailSignup} className="space-y-4">
                    {mode === 'signup' && (
                        <div>
                            <label htmlFor="name" className="sr-only">{t('signup.field.name')}</label>
                            <input id="name" name="name" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600" placeholder={t('signup.field.name')} />
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="sr-only">{t('login.field.email')}</label>
                        <input id="email" name="email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600" placeholder={t('login.field.email')} />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">{t('login.field.password')}</label>
                        <input id="password" name="password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600" placeholder={t('login.field.password')} />
                    </div>
                    {mode === 'signup' && (
                        <div>
                            <label htmlFor="confirm-password" className="sr-only">{t('signup.field.confirm_password')}</label>
                            <input id="confirm-password" name="confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600" placeholder={t('signup.field.confirm_password')} />
                        </div>
                    )}
                    
                    {error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}
                    
                    <button type="submit" className="w-full px-4 py-3 text-sm font-semibold text-white bg-sky-600 rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors">
                        {mode === 'login' ? t('login.button') : t('signup.button')}
                    </button>
                </form>

                <div className="text-sm text-center text-gray-600 dark:text-gray-400">
                    {mode === 'login' ? (
                        <span>
                            {t('login.no_account')}{' '}
                            <button onClick={toggleMode} className="font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300">{t('login.signup_now')}</button>
                        </span>
                    ) : (
                        <span>
                            {t('signup.have_account')}{' '}
                            <button onClick={toggleMode} className="font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300">{t('nav.login')}</button>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;