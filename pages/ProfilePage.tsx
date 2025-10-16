import React, { useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
import { Badge } from '../types';
import MyListings from '../components/MyListings';

const BadgeDisplay: React.FC<{ badge: Badge }> = ({ badge }) => {
    const { t } = useLocalization();
    const badgeStyles: { [key in Badge]: { icon: string, color: string } } = {
        [Badge.VerifiedReviewer]: { icon: 'fa-check-circle', color: 'text-blue-500' },
        [Badge.TopContributor]: { icon: 'fa-award', color: 'text-amber-500' },
        [Badge.NewUser]: { icon: 'fa-leaf', color: 'text-green-500' },
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${badgeStyles[badge]?.color}`}>
            <i className={`fas ${badgeStyles[badge]?.icon} mr-1.5`}></i>
            {t(`badge.${badge.replace(/\s/g, '')}`)}
        </span>
    );
};

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const { t } = useLocalization();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const newAvatarUrl = reader.result as string;
        // The updateUser function from AuthContext handles updating the user state
        // and persisting it to both session and local storage.
        updateUser({ avatarUrl: newAvatarUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('profile.title')}</h1>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <img 
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-sky-500 group-hover:opacity-75 transition-opacity" 
                  src={user.avatarUrl || user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
                  alt={user.name} 
                />
                <button 
                  onClick={handleAvatarClick}
                  title={t('profile.change_avatar')}
                  className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <i className="fas fa-camera fa-lg"></i>
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange}
                  className="hidden" 
                  accept="image/png, image/jpeg, image/gif"
                />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                <p className="text-md text-gray-500 dark:text-gray-400">{user.email}</p>
                <div className="mt-2 flex gap-2 justify-center sm:justify-start">
                    {user.badges?.map(badge => <BadgeDisplay key={badge} badge={badge} />)}
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('profile.details')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="font-medium text-gray-500 dark:text-gray-400">{t('profile.name')}</p>
                  <p className="mt-1 text-gray-900 dark:text-white">{user.name}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500 dark:text-gray-400">{t('profile.email')}</p>
                  <p className="mt-1 text-gray-900 dark:text-white">{user.email}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500 dark:text-gray-400">{t('profile.reviews_written')}</p>
                  <p className="mt-1 text-gray-900 dark:text-white">{user.reviewCount || 0}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500 dark:text-gray-400">{t('profile.status')}</p>
                  <div className="mt-1">
                    {user.verified ? (
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <i className="fas fa-check-circle mr-1"></i>
                          {t('profile.verified')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          <i className="fas fa-exclamation-circle mr-1"></i>
                          {t('profile.verification_pending')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                {t('nav.logout')}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8">
        <MyListings />
      </div>
    </div>
  );
};

export default ProfilePage;