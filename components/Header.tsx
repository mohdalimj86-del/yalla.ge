
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
import { useNotifications } from '../hooks/useNotifications';
import { MenuIcon, CloseIcon } from './icons';
import SettingsDropdown from './SettingsDropdown';
import NotificationsDropdown from './NotificationsDropdown';
import { LANGUAGE_OPTIONS } from '../constants';

const Header: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const { t, language, setLanguage } = useLocalization();
    const { unreadCount } = useNotifications();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const navLinks = [
        { path: '/accommodation', label: t('nav.accommodation') },
        { path: '/marketplace', label: t('nav.marketplace') },
        { path: '/explore', label: t('nav.explore') },
    ];

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const closeAllMenus = () => {
        setIsMobileMenuOpen(false);
        setIsProfileMenuOpen(false);
        setIsNotificationsOpen(false);
    }
    
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            closeAllMenus();
        }
    };


    const NavItem: React.FC<{ path: string; label: string; isMobile?: boolean }> = ({ path, label, isMobile }) => (
        <NavLink
            to={path}
            onClick={closeAllMenus}
            className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                    ? 'bg-sky-100 text-sky-700 dark:bg-sky-800 dark:text-sky-200'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                } ${isMobile ? 'block text-base' : ''}`
            }
        >
            {label}
        </NavLink>
    );

    const Logo: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'md' }) => {
        const sizeClasses = {
            md: {
                wrapper: 'h-8 w-8',
                letter: 'text-lg',
                text: 'text-xl',
            },
            sm: {
                wrapper: 'h-7 w-7',
                letter: 'text-base',
                text: 'text-lg',
            }
        };
        const currentSize = sizeClasses[size];
        return (
             <div className="flex items-center gap-2">
                <div className={`flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 ${currentSize.wrapper}`}>
                    <span className={`text-white font-bold ${currentSize.letter}`}>Y</span>
                </div>
                <span className={`font-bold text-gray-800 dark:text-gray-200 ${currentSize.text}`}>Yalla.ge</span>
            </div>
        )
    };

    return (
        <>
            <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-30 border-b border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link to="/" onClick={closeAllMenus}>
                               <Logo />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-1">
                            {navLinks.map(link => <NavItem key={link.path} {...link} />)}
                        </nav>

                        {/* Right side controls */}
                        <div className="flex items-center gap-2">
                           <div className="hidden md:block">
                                <form onSubmit={handleSearchSubmit} className="relative w-48 lg:w-64">
                                    <input
                                      type="search"
                                      value={searchTerm}
                                      onChange={(e) => setSearchTerm(e.target.value)}
                                      placeholder={t('search.placeholder')}
                                      aria-label="Search"
                                      className="w-full pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                    />
                                    <button type="submit" aria-label="Submit search" className="absolute right-0 top-0 mt-2 mr-3 text-gray-400 hover:text-sky-600 dark:hover:text-sky-400">
                                      <i className="fas fa-search"></i>
                                    </button>
                                  </form>
                           </div>
                           
                           <div className="hidden md:flex items-center gap-2">
                                {!isAuthenticated ? (
                                    <>
                                        <SettingsDropdown />
                                        <Link to="/login" className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700 transition-colors">
                                            {t('nav.login')}
                                        </Link>
                                    </>
                                ) : user ? (
                                    <>
                                        <div className="relative" ref={notificationsRef}>
                                            <button
                                                onClick={() => {
                                                    setIsNotificationsOpen(!isNotificationsOpen);
                                                    setIsProfileMenuOpen(false);
                                                }}
                                                className="relative flex items-center justify-center w-10 h-10 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors"
                                                aria-haspopup="true"
                                                aria-expanded={isNotificationsOpen}
                                                title="Notifications"
                                            >
                                                <i className="fas fa-bell text-lg"></i>
                                                {unreadCount > 0 && (
                                                    <span className="absolute top-0 right-0 block h-5 w-5 transform translate-x-1/4 -translate-y-1/4">
                                                        <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping"></span>
                                                        <span className="relative inline-flex items-center justify-center rounded-full h-5 w-5 bg-red-600 text-white text-xs font-bold">
                                                            {unreadCount}
                                                        </span>
                                                    </span>
                                                )}
                                            </button>
                                            {isNotificationsOpen && <NotificationsDropdown onClose={() => setIsNotificationsOpen(false)} />}
                                        </div>

                                        <div className="relative" ref={profileMenuRef}>
                                            <button onClick={() => {
                                                setIsProfileMenuOpen(!isProfileMenuOpen);
                                                setIsNotificationsOpen(false);
                                            }} className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                                                <img className="h-9 w-9 rounded-full object-cover" src={user.avatarUrl || user.picture || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} />
                                            </button>
                                            {isProfileMenuOpen && (
                                                <div className={`absolute ${language === 'ar' ? 'left-0' : 'right-0'} mt-2 w-64 bg-white dark:bg-gray-700 rounded-md shadow-lg z-20 overflow-hidden ring-1 ring-black ring-opacity-5`}>
                                                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                                    </div>
                                                    <div className="py-1">
                                                        <Link to="/profile" onClick={closeAllMenus} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                                                            <i className="fas fa-user-circle fa-fw mr-2"></i>
                                                            <span>{t('nav.profile')}</span>
                                                        </Link>
                                                        <Link to="/messages" onClick={closeAllMenus} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                                                            <i className="fas fa-comments fa-fw mr-2"></i>
                                                            <span>Messages</span>
                                                        </Link>
                                                    </div>
                                                    
                                                    <div className="border-t border-gray-200 dark:border-gray-700">
                                                        <div className="py-2 px-2">
                                                            <div className="px-2 mb-1">
                                                                <h4 className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500">Language</h4>
                                                            </div>
                                                            {LANGUAGE_OPTIONS.map(option => (
                                                                <button
                                                                    key={option.code}
                                                                    onClick={() => { setLanguage(option.code); setIsProfileMenuOpen(false); }}
                                                                    className={`w-full text-left flex items-center px-2 py-1.5 text-sm rounded-md transition-colors ${
                                                                        language === option.code
                                                                        ? 'bg-sky-50 text-sky-700 dark:bg-sky-800/50 dark:text-sky-200'
                                                                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                                    }`}
                                                                >
                                                                    <span className="mr-3 text-lg w-6 text-center">{option.flag}</span>
                                                                    <span>{option.name}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="border-t border-gray-200 dark:border-gray-700 py-1">
                                                        <button onClick={() => { logout(); closeAllMenus(); }} className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600">
                                                            <i className="fas fa-sign-out-alt fa-fw mr-2"></i>
                                                            <span>{t('nav.logout')}</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : null}
                           </div>

                            {/* Mobile menu button */}
                            <div className="md:hidden">
                                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
                                    <span className="sr-only">Open main menu</span>
                                    {isMobileMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay & Drawer */}
            <div className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {/* Overlay */}
                <div
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="absolute inset-0 bg-black/60"
                    aria-hidden="true"
                ></div>

                {/* Drawer */}
                <div
                    className={`relative flex flex-col h-full w-72 max-w-[80vw] bg-white dark:bg-gray-800 shadow-xl transition-transform duration-300 ease-in-out transform ${
                        language === 'ar' ? 'ml-auto' : 'mr-auto'
                    } ${
                        isMobileMenuOpen
                            ? 'translate-x-0'
                            : language === 'ar'
                            ? 'translate-x-full'
                            : '-translate-x-full'
                    }`}
                >
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200 dark:border-gray-700">
                        <Link to="/" onClick={closeAllMenus}>
                            <Logo size="sm"/>
                        </Link>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                           <span className="sr-only">Close menu</span>
                            <CloseIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Drawer Body */}
                    <div className="flex-grow p-4 overflow-y-auto">
                        <form onSubmit={handleSearchSubmit} className="relative mb-6">
                            <input
                              type="search"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              placeholder={t('search.placeholder')}
                              aria-label="Search"
                              className="w-full pl-4 pr-10 py-3 text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            />
                            <button type="submit" aria-label="Submit search" className="absolute right-0 top-0 mt-3 mr-4 text-gray-400 hover:text-sky-600 dark:hover:text-sky-400">
                              <i className="fas fa-search"></i>
                            </button>
                        </form>

                        <nav className="flex flex-col space-y-2 mb-6">
                            {navLinks.map(link => <NavItem key={link.path} {...link} isMobile />)}
                        </nav>

                        {!isAuthenticated && (
                            <div className="mb-6">
                                <Link to="/login" onClick={closeAllMenus} className="block w-full text-center px-4 py-3 text-base font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700 transition-colors">
                                    {t('nav.login')}
                                </Link>
                            </div>
                        )}
                        
                        <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div>
                                <h3 className="px-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Language</h3>
                                <div className="mt-2 space-y-1">
                                    {LANGUAGE_OPTIONS.map(option => (
                                        <button
                                            key={option.code}
                                            onClick={() => {
                                                setLanguage(option.code);
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className={`w-full text-left flex items-center px-2 py-2 text-sm rounded-md transition-colors ${
                                                language === option.code
                                                ? 'bg-sky-100 text-sky-700 dark:bg-sky-800 dark:text-sky-200'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                            type="button"
                                        >
                                            <span className="mr-3 text-lg w-6 text-center">{option.flag}</span>
                                            <span>{option.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
