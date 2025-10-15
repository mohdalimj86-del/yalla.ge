
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { Notification, NotificationType } from '../types';

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

const NotificationsPage: React.FC = () => {
    const { notifications, markAsRead, markAllAsRead } = useNotifications();
    const navigate = useNavigate();

    const handleNotificationClick = (notification: Notification) => {
        markAsRead(notification.id);
        if (notification.link) {
            navigate(notification.link);
        }
    };
    
    const sortedNotifications = [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                <button
                    onClick={markAllAsRead}
                    className="text-sm font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                >
                    Mark all as read
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {sortedNotifications.length > 0 ? (
                        sortedNotifications.map(notification => (
                            <li
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`flex items-start gap-4 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${!notification.read ? 'bg-sky-50 dark:bg-sky-900/20' : ''}`}
                            >
                                <NotificationIcon type={notification.type} />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-800 dark:text-gray-200">{notification.message}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(notification.createdAt).toLocaleString()}</p>
                                </div>
                                {!notification.read && <div className="w-2.5 h-2.5 bg-sky-500 rounded-full flex-shrink-0 self-center"></div>}
                            </li>
                        ))
                    ) : (
                         <li className="text-center p-8">
                            <p className="text-gray-500 dark:text-gray-400">You have no notifications.</p>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default NotificationsPage;
