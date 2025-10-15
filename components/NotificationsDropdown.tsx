
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { Notification, NotificationType } from '../types';

const timeSince = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)}y`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)}mo`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)}d`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)}h`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)}m`;
    return `${Math.floor(seconds)}s`;
};

const NotificationIcon: React.FC<{ type: NotificationType }> = ({ type }) => {
    const iconMap: { [key in NotificationType]: { icon: string; color: string } } = {
        [NotificationType.NewReview]: { icon: 'fa-star', color: 'bg-yellow-500' },
        [NotificationType.ListingApproved]: { icon: 'fa-check', color: 'bg-green-500' },
        [NotificationType.NewMessage]: { icon: 'fa-comment', color: 'bg-blue-500' },
        [NotificationType.PriceChange]: { icon: 'fa-tag', color: 'bg-purple-500' },
        [NotificationType.System]: { icon: 'fa-info-circle', color: 'bg-gray-500' },
    };

    const { icon, color } = iconMap[type] || iconMap[NotificationType.System];

    return (
        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white ${color}`}>
            <i className={`fas ${icon}`}></i>
        </div>
    );
};

const NotificationsDropdown: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { notifications, markAsRead, markAllAsRead } = useNotifications();
    const navigate = useNavigate();
    
    const sortedNotifications = [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const handleNotificationClick = (notification: Notification) => {
        markAsRead(notification.id);
        onClose();
        if (notification.link) {
            navigate(notification.link);
        }
    };

    return (
        <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl z-50 ring-1 ring-black ring-opacity-5 overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">Notifications</h3>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        markAllAsRead();
                    }}
                    className="text-xs text-sky-600 dark:text-sky-400 hover:underline"
                >
                    Mark all as read
                </button>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
                {sortedNotifications.length > 0 ? (
                    sortedNotifications.map(notification => (
                        <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`flex items-start gap-4 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${!notification.read ? 'bg-sky-50 dark:bg-sky-900/20' : ''}`}
                        >
                            <NotificationIcon type={notification.type} />
                            <div className="flex-1">
                                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{notification.message}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{timeSince(new Date(notification.createdAt))} ago</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-8">
                        <p className="text-sm text-gray-500 dark:text-gray-400">No new notifications</p>
                    </div>
                )}
            </div>
            
             <div className="text-center p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <Link to="/notifications" onClick={onClose} className="text-sm font-semibold text-sky-600 dark:text-sky-400 hover:underline">
                    View all notifications
                </Link>
            </div>
        </div>
    );
};

export default NotificationsDropdown;
