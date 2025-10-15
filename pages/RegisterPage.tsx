
import React, { useEffect, useState } from 'react';
import { useGoogleLogin, TokenResponse } from '@react-oauth/google';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
import { User, Badge } from '../types';
import GoogleLoginButton from '../components/GoogleLoginButton';

const RegisterPage: React.FC = () => {
    const { register, isAuthenticated, login } = useAuth();
    const { t } = useLocalization();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/profile', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const processGoogleLogin = (gUser: Omit<User, 'id'>) => {
        const newUser = { ...gUser, id: `google_${Date.now()}` };
        login(newUser, true);
        navigate('/');
    };

    const handleGoogleRegisterSuccess = (tokenResponse: Omit<TokenResponse, 'error' | 'error_description' | 'error_uri'>) => {
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
             const newUser: Omit<User, 'id'> = {
                name: data.name,
                email: data.email,
                picture: data.picture,
                verified: true,
                reviewCount: 0,
                badges: [Badge.NewUser]
            };
            processGoogleLogin(newUser);
        })
        .catch(err => {
            console.error('Failed to fetch user info from Google:', err);
            setError(t('login.error.google'));
        })
        .finally(() => setLoading(false));
    };
    
     const googleRegister = useGoogleLogin({
        onSuccess: handleGoogleRegisterSuccess,
        onError: () => {
             setError(t('login.error.google'));
             setLoading(false);
        },
    });

    const handleEmailRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError(t('signup.error.password_mismatch'));
            return;
        }
        if (password.length < 6) {
            setError(t('signup.error.weak_password'));
            return;
        }
        if (!agreedToTerms) {
            setError('You must agree to the terms and conditions.');
            return;
        }

        setLoading(true);
        try {
            await register(name, email, password);
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('signup.title')}</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">{t('signup.subtitle')}</p>
                </div>
                
                <form onSubmit={handleEmailRegister} className="space-y-4">
                     <div>
                        <label htmlFor="name" className="sr-only">{t('signup.field.name')}</label>
                        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder={t('signup.field.name')} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                     <div>
                        <label htmlFor="email-register" className="sr-only">{t('login.field.email')}</label>
                        <input id="email-register" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder={t('login.field.email')} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                     <div>
                        <label htmlFor="password-register" className="sr-only">{t('login.field.password')}</label>
                        <input id="password-register" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder={t('login.field.password')} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                     <div>
                        <label htmlFor="confirm-password" className="sr-only">{t('signup.field.confirm_password')}</label>
                        <input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder={t('signup.field.confirm_password')} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                     <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input id="terms" name="terms" type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-gray-300 rounded" />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="terms" className="font-medium text-gray-700 dark:text-gray-300">I agree to the <Link to="/terms" className="text-sky-600 hover:underline">Terms</Link> and <Link to="/privacy" className="text-sky-600 hover:underline">Privacy Policy</Link></label>
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}

                    <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50">
                        {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : t('signup.button')}
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

                <div>
                   <GoogleLoginButton onClick={() => { if(!loading) googleRegister() }} disabled={loading} text={t('login.google')} />
                </div>

                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                    {t('signup.have_account')}{' '}
                    <Link to="/login" className="font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300">{t('nav.login')}</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
