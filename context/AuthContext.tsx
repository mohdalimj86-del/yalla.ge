import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { User } from '../types';

// In a real app, this would be a secure backend. For this demo, we use localStorage.
// WARNING: Storing user data and especially passwords in localStorage is insecure.
const MOCK_USERS_DB_KEY = 'yalla_users_db';

// Helper to get users from localStorage
const getMockUsers = (): User[] => {
    try {
        const users = localStorage.getItem(MOCK_USERS_DB_KEY);
        return users ? JSON.parse(users) : [];
    } catch (e) {
        return [];
    }
};

// Helper to save users to localStorage
const saveMockUsers = (users: User[]) => {
    localStorage.setItem(MOCK_USERS_DB_KEY, JSON.stringify(users));
};


interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isNewUser: boolean;
  login: (user: User, isNew?: boolean) => void;
  logout: () => void;
  updateUser: (updatedUserData: Partial<User>) => void;
  clearNewUserFlag: () => void;
  incrementReviewCount: () => void;
  findUserByEmail: (email: string) => User | undefined;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [mockUsers, setMockUsers] = useState<User[]>(getMockUsers);

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
  
   useEffect(() => {
    saveMockUsers(mockUsers);
  }, [mockUsers]);


  const login = (userData: User, isNew: boolean = false) => {
    setUser(userData);
    sessionStorage.setItem('user', JSON.stringify(userData));
    
    // Check if a user with this email exists in our mock DB. If not, add them.
    // This handles users created via Google Login.
    const userExists = mockUsers.some(u => u.id === userData.id || u.email === userData.email);
    if (!userExists) {
        setMockUsers(prevUsers => [...prevUsers, userData]);
    }

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

        // Also update the user in our mock DB
        setMockUsers(prevUsers => prevUsers.map(u => u.id === newUser.id ? newUser : u));
        
        return newUser;
    });
  }, []);
  
  const incrementReviewCount = useCallback(() => {
    updateUser({ reviewCount: (user?.reviewCount || 0) + 1 });
  }, [user, updateUser]);

  const clearNewUserFlag = useCallback(() => {
    setIsNewUser(false);
  }, []);
  
  const findUserByEmail = useCallback((email: string): User | undefined => {
      return mockUsers.find(u => u.email === email);
  }, [mockUsers]);

  const register = useCallback(async (name: string, email: string, password: string): Promise<void> => {
      return new Promise((resolve, reject) => {
          setTimeout(() => { // Simulate network delay
              if (findUserByEmail(email)) {
                  return reject(new Error('An account with this email already exists. Please log in.'));
              }

              const verificationToken = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
              const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

              const newUser: User & { password?: string } = {
                  id: `email_${Date.now()}`,
                  name,
                  email,
                  password, // WARNING: Storing plain text password for demo only. NEVER do this in production.
                  verified: false,
                  verificationToken,
                  verificationTokenExpires,
                  reviewCount: 0,
                  badges: [],
              };

              setMockUsers(prevUsers => [...prevUsers, newUser]);
              login(newUser, true);
              resolve();
          }, 1000);
      });
  }, [findUserByEmail, login]);

  const loginWithEmail = useCallback(async (email: string, password: string): Promise<void> => {
      return new Promise((resolve, reject) => {
          setTimeout(() => { // Simulate network delay
              const foundUser = mockUsers.find(u => u.email === email) as User & { password?: string };

              // WARNING: Comparing plain text passwords for demo only. NEVER do this in production.
              if (!foundUser || foundUser.password !== password) {
                  return reject(new Error('Invalid email or password. Please try again.'));
              }
              
              // Don't pass password to login function
              const { password: _, ...userToLogin } = foundUser;

              login(userToLogin);
              resolve();
          }, 1000);
      });
  }, [mockUsers, login]);


  return (
    <AuthContext.Provider value={{ 
        user, 
        isAuthenticated: !!user, 
        isNewUser, 
        login, 
        logout, 
        updateUser, 
        clearNewUserFlag, 
        incrementReviewCount,
        findUserByEmail,
        register,
        loginWithEmail
    }}>
      {children}
    </AuthContext.Provider>
  );
};