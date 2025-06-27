
"use client";

import type { UserRole } from '@/types';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

interface UserRoleContextType {
  user: User | null;
  role: UserRole;
  setRoleForUser: (uid: string, role: UserRole) => void;
  logout: () => void;
  isLoading: boolean;
}

export const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

const USER_ROLE_STORAGE_KEY_PREFIX = 'tutortrack_user_role_';

export const UserRoleProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const storedRole = localStorage.getItem(`${USER_ROLE_STORAGE_KEY_PREFIX}${firebaseUser.uid}`) as UserRole;
          setRole(storedRole || null);
        } catch (error) {
          console.error("Failed to access localStorage:", error);
          setRole(null);
        }
      } else {
        setRole(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setRoleForUser = (uid: string, newRole: UserRole) => {
    if (newRole) {
      try {
        localStorage.setItem(`${USER_ROLE_STORAGE_KEY_PREFIX}${uid}`, newRole);
        setRole(newRole);
      } catch (error) {
        console.error("Failed to write to localStorage:", error);
      }
    }
  };

  const logout = async () => {
    if (user) {
        try {
            localStorage.removeItem(`${USER_ROLE_STORAGE_KEY_PREFIX}${user.uid}`);
        } catch (error) {
            console.error("Failed to access localStorage:", error);
        }
    }
    await auth.signOut();
    router.push('/');
  };
  
  // This effect handles redirection after login/signup
  useEffect(() => {
    if (!isLoading && !isRedirecting && user && role) {
      setIsRedirecting(true);
      router.push(`/${role}/dashboard`);
    }
  }, [user, role, isLoading, router, isRedirecting]);

  return (
    <UserRoleContext.Provider value={{ user, role, setRoleForUser, logout, isLoading }}>
      {children}
    </UserRoleContext.Provider>
  );
};
