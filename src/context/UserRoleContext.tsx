"use client";

import type { UserRole } from '@/types';
import { useRouter } from 'next/navigation';
import type { Dispatch, ReactNode, SetStateAction} from 'react';
import React, { createContext, useState, useEffect } from 'react';

interface UserRoleContextType {
  role: UserRole;
  setRole: Dispatch<SetStateAction<UserRole>>;
  login: (role: UserRole) => void;
  logout: () => void;
  isLoading: boolean;
}

export const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

const USER_ROLE_STORAGE_KEY = 'tutortrack_user_role';

export const UserRoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedRole = localStorage.getItem(USER_ROLE_STORAGE_KEY) as UserRole;
      if (storedRole) {
        setRole(storedRole);
      }
    } catch (error) {
      console.error("Failed to access localStorage:", error);
      // Fallback or error handling if localStorage is not available
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && role) {
      try {
        localStorage.setItem(USER_ROLE_STORAGE_KEY, role);
      } catch (error) {
         console.error("Failed to access localStorage:", error);
      }
    }
  }, [role, isLoading]);

  const login = (newRole: UserRole) => {
    if (newRole) {
      setRole(newRole);
      router.push(`/${newRole}/dashboard`);
    }
  };

  const logout = () => {
    setRole(null);
    try {
      localStorage.removeItem(USER_ROLE_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to access localStorage:", error);
    }
    router.push('/');
  };

  return (
    <UserRoleContext.Provider value={{ role, setRole, login, logout, isLoading }}>
      {children}
    </UserRoleContext.Provider>
  );
};
