
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Notification } from '../types';
import { mockNotifications as initialNotifications } from '../data/mockData';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NOTIFICATIONS_STORAGE_KEY = 'userNotifications';

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (stored) {
        setNotifications(JSON.parse(stored));
      } else {
        // First time load, initialize with mock data
        setNotifications(initialNotifications);
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(initialNotifications));
      }
    } catch (error) {
      console.error("Failed to load notifications from local storage", error);
      setNotifications(initialNotifications);
    }
  }, []);

  const saveNotifications = (updatedNotifications: Notification[]) => {
    setNotifications(updatedNotifications);
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updatedNotifications));
  };

  const markAsRead = useCallback((id: string) => {
    setNotifications(currentNotifications => {
        const updatedNotifications = currentNotifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        );
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updatedNotifications));
        return updatedNotifications;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(currentNotifications => {
        const updatedNotifications = currentNotifications.map(n => ({ ...n, read: true }));
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updatedNotifications));
        return updatedNotifications;
    });
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
