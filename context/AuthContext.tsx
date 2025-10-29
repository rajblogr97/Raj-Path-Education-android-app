import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../constants';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  signup: (userData: Omit<User, 'role' | 'id' | 'joinDate' | 'enrolledCourses'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = sessionStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      return null;
    }
  });

  const login = (email: string, password: string): boolean => {
    // Mock authentication against our constant list
    const foundUser = MOCK_USERS.find(u => u.email === email);
    // In a real app, you'd check a hashed password. Here we simplify.
    if (foundUser && password === 'password') { 
        setUser(foundUser);
        sessionStorage.setItem('user', JSON.stringify(foundUser));
        return true;
    }
    return false;
  };

  const signup = (userData: Omit<User, 'role' | 'id' | 'joinDate' | 'enrolledCourses'>) => {
    // In a real app, this would create a user in the backend.
    // Here, we create a new student user and log them in.
    const newUser: User = { 
        ...userData, 
        id: Math.max(...MOCK_USERS.map(u => u.id)) + 1,
        role: 'Student',
        joinDate: new Date().toISOString().split('T')[0],
        enrolledCourses: 0,
    };
    setUser(newUser);
    sessionStorage.setItem('user', JSON.stringify(newUser));
  };


  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    // Optionally, redirect to login page
    window.location.hash = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};