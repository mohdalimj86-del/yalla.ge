import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';

const VerifyEmailPage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { t } = useLocalization();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        const token = searchParams.get('token');

        if (user && !user.verified) {
            // Validate the token
            if (!token || token !== user.verificationToken) {
                setStatus('error');
                setErrorMessage(t('verification.error_text_invalid'));
                return;
            }
            // Check if token is expired
            if (user.verificationTokenExpires && Date.now() > user.verificationTokenExpires) {
                setStatus('error');
                setErrorMessage(t('verification.error_text_expired'));
                return;
            }

            // Simulate API call and update user context
            setTimeout(() => {
                updateUser({ 
                    verified: true,
                    verificationToken: undefined,
                    verificationTokenExpires: undefined,
                });
                setStatus('success');
            }, 1500);
        } else if (user?.verified) {
            // Already verified, just redirect
            setStatus('success');
        } else {
            // No user logged in, or some other issue
            setStatus('error');
            setErrorMessage(t('verification.error_text'));
        }
    }, [user, updateUser, searchParams, t]);

    useEffect(() => {
        if (status === 'success') {
            const timer = setTimeout(() => {
                navigate('/');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [status, navigate]);

    const renderContent = () => {
        switch (status) {
            case 'verifying':
                return (
                    <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
                        <h1 className="text-2xl font-semibold mt-4">{t('verification.verifying')}</h1>
                    </>
                );
            case 'success':
                return (
                    <>
                        <i className="fas fa-check-circle text-6xl text-green-500"></i>
                        <h1 className="text-3xl font-bold mt-4">{t('verification.success_title')}</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">{t('verification.success_text')}</p>
                    </>
                );
            case 'error':
                return (
                     <>
                        <i className="fas fa-times-circle text-6xl text-red-500"></i>
                        <h1 className="text-3xl font-bold mt-4">{t('verification.error_title')}</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">{errorMessage}</p>
                    </>
                );
        }
    };

    return (
        <div className="flex items-center justify-center text-center h-full py-20">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg flex flex-col items-center">
                {renderContent()}
            </div>
        </div>
    );
};

export default VerifyEmailPage;