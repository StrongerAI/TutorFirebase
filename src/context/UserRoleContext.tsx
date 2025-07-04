
"use client";

import type { UserRole } from '@/types';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface UserRoleContextType {
  user: User | null;
  role: UserRole;
  setRoleForUser: (uid: string, role: UserRole) => Promise<void>;
  setGuestRole: (role: UserRole) => void;
  logout: () => void;
  isLoading: boolean;
}

export const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

const GUEST_ROLE_STORAGE_KEY = 'tutortrack_guest_role';

export const UserRoleProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        // User is signed in, fetch their role from Firestore.
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setRole(userDoc.data().role as UserRole);
          } else {
            // This can happen for a new user before their role is set.
            setRole(null);
          }
          sessionStorage.removeItem(GUEST_ROLE_STORAGE_KEY);
        } catch (error) {
          console.error("Error fetching user role from Firestore:", error);
          setRole(null);
        }
      } else {
        // User is signed out.
        setUser(null);
        // Check for a guest role in session storage.
        const guestRole = sessionStorage.getItem(GUEST_ROLE_STORAGE_KEY) as UserRole;
        setRole(guestRole);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setRoleForUser = async (uid: string, newRole: UserRole) => {
    if (newRole) {
      try {
        const userDocRef = doc(db, "users", uid);
        await setDoc(userDocRef, { role: newRole });
        setRole(newRole); // Update state immediately after setting the doc
        sessionStorage.removeItem(GUEST_ROLE_STORAGE_KEY);
      } catch (error) {
        console.error("Failed to set user role in Firestore:", error);
      }
    }
  };

  const setGuestRole = useCallback((newRole: UserRole) => {
    if (newRole && !user) { // Only allow guest role if not logged in
      try {
        sessionStorage.setItem(GUEST_ROLE_STORAGE_KEY, newRole);
        setRole(newRole);
        router.push(`/${newRole}/dashboard`);
      } catch (error) {
        console.error("Failed to write to sessionStorage:", error);
      }
    }
  }, [user, router]);

  const logout = async () => {
    try {
      await auth.signOut();
      sessionStorage.removeItem(GUEST_ROLE_STORAGE_KEY);
      setRole(null);
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  // This effect handles redirection for authenticated (non-guest) users
  useEffect(() => {
    if (!isLoading && user && role) {
      const targetPath = `/${role}/dashboard`;
      // To prevent unnecessary re-renders and redirects, only push if not already there.
      if (window.location.pathname !== targetPath) {
        router.push(targetPath);
      }
    }
  }, [user, role, isLoading, router]);

  return (
    <UserRoleContext.Provider value={{ user, role, setRoleForUser, setGuestRole, logout, isLoading }}>
      {children}
    </UserRoleContext.Provider>
  );
};
