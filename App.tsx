
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LocalizationProvider } from './context/LocalizationContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { ThemeProvider } from './context/ThemeContext';
import { ListingProvider } from './context/ListingContext';
import { NotificationProvider } from './context/NotificationContext';
import { MessageProvider } from './context/MessageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AccommodationPage from './pages/AccommodationPage';
import MarketplacePage from './pages/MarketplacePage';
import ExplorePage from './pages/ExplorePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import VerificationBanner from './components/VerificationBanner';
import AddListingPage from './pages/AddListingPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import SearchResultsPage from './pages/SearchResultsPage';
import WelcomeAvatarModal from './components/WelcomeAvatarModal';
import ListingDetailPage from './pages/ListingDetailPage';
import NotificationsPage from './pages/NotificationsPage';
import MessagesPage from './pages/MessagesPage';

// Declare FB SDK global object
declare const FB: any;

// Extend the window interface for the fbAsyncInit callback
declare global {
  interface Window {
    fbAsyncInit: () => void;
  }
}

const AppContent: React.FC = () => {
  const { user, isNewUser, clearNewUserFlag } = useAuth();
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);

  useEffect(() => {
    if (isNewUser && user) {
      setIsWelcomeModalOpen(true);
    }
  }, [isNewUser, user]);

  const handleWelcomeModalClose = () => {
    if (user) {
      localStorage.setItem(`welcome_shown_${user.id}`, 'true');
    }
    setIsWelcomeModalOpen(false);
    clearNewUserFlag();
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-800 dark:text-gray-200">
      <Header />
      <VerificationBanner />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/accommodation" element={<AccommodationPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/listing/:id" element={<ListingDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/add-listing/:category" element={<AddListingPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/messages/:conversationId" element={<MessagesPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </main>
      <Footer />
      {user && <WelcomeAvatarModal isOpen={isWelcomeModalOpen} onClose={handleWelcomeModalClose} userName={user.name} />}
    </div>
  );
}

const App: React.FC = () => {
  // The Google Client ID for OAuth.
  const googleClientId = "787924331613-3h8em13gcpmlt95k3gpf9r1q9f8lgr63.apps.googleusercontent.com";

  // Initialize Facebook SDK
  useEffect(() => {
    // In a real app, this App ID would come from environment variables.
    // WARNING: Do not hardcode App IDs in production code.
    const facebookAppId = "399033393043249"; // This is a placeholder.

    window.fbAsyncInit = function() {
      FB.init({
        appId      : facebookAppId,
        cookie     : true,
        xfbml      : true,
        version    : 'v19.0'
      });
    };

    // Load the SDK script
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       if (fjs && fjs.parentNode) {
        fjs.parentNode.insertBefore(js, fjs);
       } else {
        d.body.appendChild(js);
       }
     }(document, 'script', 'facebook-jssdk'));
  }, []);

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <ThemeProvider>
        <AuthProvider>
          <LocalizationProvider>
            <ListingProvider>
              <NotificationProvider>
                <MessageProvider>
                  <HashRouter>
                    <AppContent />
                  </HashRouter>
                </MessageProvider>
              </NotificationProvider>
            </ListingProvider>
          </LocalizationProvider>
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
