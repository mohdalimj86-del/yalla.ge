import React, { useEffect, useState } from 'react';
import { useGoogleLogin, TokenResponse } from '@react-oauth/google';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
import { User, Badge } from '../types';
import GoogleLoginButton from '../components/GoogleLoginButton';
import FacebookLoginButton from '../components/FacebookLoginButton';

// Declare FB SDK global object
declare const FB: any;

const LoginPage: React.FC = () => {
    const { loginWithEmail, isAuthenticated, login, findUserByEmail } = useAuth();
    const { t } = useLocalization();
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isHttps, setIsHttps] = useState(false);

    useEffect(() => {
        setIsHttps(window.location.protocol === 'https:');
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/profile', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const processLogin = (user: User, isNew: boolean = false) => {
        const welcomeShown = localStorage.getItem(`welcome_shown_${user.id}`);
        login(user, isNew || !welcomeShown);
        navigate('/');
    };

    const handleGoogleLoginSuccess = (tokenResponse: Omit<TokenResponse, 'error' | 'error_description' | 'error_uri'>) => {
        setLoading(true);
        setError('');
        fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
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
            const existingUser = findUserByEmail(data.email);
            if(existingUser) {
                processLogin(existingUser, false);
            } else {
                 const newUser: User = {
                    id: data.sub || data.id, // Use 'sub' for unique ID
                    name: data.name,
                    email: data.email,
                    picture: data.picture,
                    verified: true,
                    reviewCount: 0,
                    badges: [Badge.NewUser]
                };
                processLogin(newUser, true);
            }
        })
        .catch(err => {
            console.error('Failed to fetch user info from Google:', err);
            setError(t('login.error.google'));
        })
        .finally(() => setLoading(false));
    };

    const googleLogin = useGoogleLogin({
        onSuccess: handleGoogleLoginSuccess,
        onError: () => {
            setError(t('login.error.google'));
            setLoading(false);
        },
    });
    
    const handleFacebookLogin = () => {
        if (!isHttps) {
            setError("Facebook login requires a secure (HTTPS) connection.");
            return;
        }
        if (loading) return;
        setLoading(true);
        setError('');

        if (typeof FB === 'undefined') {
            setError('Facebook SDK is loading. Please try again in a moment.');
            setLoading(false);
            return;
        }

        FB.login((response: any) => {
            if (response.authResponse) {
                FB.api('/me', { fields: 'name,email,picture.type(large)' }, (profileResponse: any) => {
                    if (profileResponse && !profileResponse.error) {
                        const { name, email, picture } = profileResponse;
                        
                        if (!email) {
                            setError("Could not retrieve email from Facebook. Please ensure your Facebook account has a verified email.");
                            setLoading(false);
                            FB.logout();
                            return;
                        }

                        const existingUser = findUserByEmail(email);
                        if (existingUser) {
                            processLogin(existingUser, false);
                        } else {
                            const newUser: User = {
                                id: `fb_${profileResponse.id}`,
                                name,
                                email,
                                picture: picture?.data?.url,
                                verified: true,
                                reviewCount: 0,
                                badges: [Badge.NewUser]
                            };
                            processLogin(newUser, true);
                        }
                    } else {
                        setError(t('login.error.google')); // Re-using generic social login error
                        setLoading(false);
                    }
                });
            } else {
                setError('Facebook login was cancelled or failed.');
                setLoading(false);
            }
        }, { scope: 'email,public_profile' });
    };


    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }
        setLoading(true);
        try {
            await loginWithEmail(email, password);
            navigate('/');
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
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
                
                <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 sr-only">{t('login.field.email')}</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('login.field.email')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 sr-only">{t('login.field.password')}</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                             value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t('login.field.password')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        />
                    </div>
                    <div className="text-right text-sm">
                        <a href="#" className="font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300">
                            Forgot password?
                        </a>
                    </div>
                    
                    {error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : t('login.button')}
                    </button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">{t('login.or_divider')}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <GoogleLoginButton onClick={() => { if(!loading) googleLogin() }} disabled={loading} text={t('login.google')} />
                    <FacebookLoginButton 
                        onClick={handleFacebookLogin} 
                        disabled={loading || !isHttps} 
                        text={t('login.facebook')} 
                        title={!isHttps ? "Facebook login requires a secure (HTTPS) connection." : undefined}
                    />
                </div>

                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                    {t('login.no_account')}{' '}
                    <Link to="/register" className="font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300">
                        {t('login.signup_now')}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;