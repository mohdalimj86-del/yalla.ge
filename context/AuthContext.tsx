
import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isNewUser: boolean;
  login: (user: User, isNew?: boolean) => void;
  logout: () => void;
  updateUser: (updatedUserData: Partial<User>) => void;
  clearNewUserFlag: () => void;
  incrementReviewCount: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    // Check for a logged-in user in session storage
    try {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
        console.error("Failed to parse user from session storage", error);
        sessionStorage.removeItem('user');
    }
  }, []);

  const login = (userData: User, isNew: boolean = false) => {
    setUser(userData);
    sessionStorage.setItem('user', JSON.stringify(userData));
    if (isNew) {
      setIsNewUser(true);
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    setIsNewUser(false);
  };

  const updateUser = useCallback((updatedUserData: Partial<User>) => {
    setUser(currentUser => {
        if (!currentUser) return null;
        const newUser = { ...currentUser, ...updatedUserData };
        sessionStorage.setItem('user', JSON.stringify(newUser));
        return newUser;
    });
  }, []);
  
  const incrementReviewCount = useCallback(() => {
    updateUser({ reviewCount: (user?.reviewCount || 0) + 1 });
  }, [user, updateUser]);

  const clearNewUserFlag = useCallback(() => {
    setIsNewUser(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isNewUser, login, logout, updateUser, clearNewUserFlag, incrementReviewCount }}>
      {children}
    </AuthContext.Provider>
  );
};
