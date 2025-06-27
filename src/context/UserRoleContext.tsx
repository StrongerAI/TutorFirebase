
"use client";

import type { UserRole } from '@/types';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

interface UserRoleContextType {
  user: User | null;
  role: UserRole;
  setRoleForUser: (uid: string, role: UserRole) => void;
  setGuestRole: (role: UserRole) => void;
  logout: () => void;
  isLoading: boolean;
}

export const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

const USER_ROLE_STORAGE_KEY_PREFIX = 'tutortrack_user_role_';
const GUEST_ROLE_STORAGE_KEY = 'tutortrack_guest_role';

export const UserRoleProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setIsLoading(true);
      setUser(firebaseUser);
      if (firebaseUser) {
        // A user is logged in.
        try {
          sessionStorage.removeItem(GUEST_ROLE_STORAGE_KEY); // Clear any guest role
          const storedRole = localStorage.getItem(`${USER_ROLE_STORAGE_KEY_PREFIX}${firebaseUser.uid}`) as UserRole;
          setRole(storedRole || null);
        } catch (error) {
          console.error("Failed to access localStorage:", error);
          setRole(null);
        }
      } else {
        // No user logged in, check for a guest role.
        try {
          const guestRole = sessionStorage.getItem(GUEST_ROLE_STORAGE_KEY) as UserRole;
          setRole(guestRole);
        } catch (error) {
          console.error("Failed to access sessionStorage:", error);
          setRole(null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setRoleForUser = (uid: string, newRole: UserRole) => {
    if (newRole) {
      try {
        sessionStorage.removeItem(GUEST_ROLE_STORAGE_KEY);
        localStorage.setItem(`${USER_ROLE_STORAGE_KEY_PREFIX}${uid}`, newRole);
        setRole(newRole);
      } catch (error) {
        console.error("Failed to write to localStorage:", error);
      }
    }
  };

  const setGuestRole = useCallback((newRole: UserRole) => {
    if (newRole && !user) { // Only set guest role if not logged in
      try {
        sessionStorage.setItem(GUEST_ROLE_STORAGE_KEY, newRole);
        setRole(newRole);
      } catch (error) {
        console.error("Failed to write to sessionStorage:", error);
      }
    }
  }, [user]);

  const logout = async () => {
    if (user) {
        try {
            localStorage.removeItem(`${USER_ROLE_STORAGE_KEY_PREFIX}${user.uid}`);
        } catch (error) {
            console.error("Failed to access localStorage:", error);
        }
    }
    try {
        sessionStorage.removeItem(GUEST_ROLE_STORAGE_KEY);
    } catch (error) {
        console.error("Failed to access sessionStorage:", error);
    }
    await auth.signOut();
    setRole(null); // Clear role from state
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
    <UserRoleContext.Provider value={{ user, role, setRoleForUser, setGuestRole, logout, isLoading }}>
      {children}
    </UserRoleContext.Provider>
  );
};
