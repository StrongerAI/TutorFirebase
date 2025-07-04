
"use client";

import type { UserRole } from '@/types';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, type User, signInAnonymously } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface UserRoleContextType {
  user: User | null;
  role: UserRole;
  setRoleForUser: (uid: string, role: UserRole) => Promise<void>;
  setGuestRole: (role: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

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
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setRole(userDoc.data().role as UserRole);
          } else {
            setRole(null);
          }
        } catch (error) {
          console.error("Error fetching user role from Firestore:", error);
          setRole(null);
        }
      } else {
        setUser(null);
        setRole(null);
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
        setRole(newRole);
      } catch (error) {
        console.error("Failed to set user role in Firestore:", error);
      }
    }
  };

  const setGuestRole = useCallback(async (newRole: UserRole) => {
    if (newRole && !user) {
      setIsLoading(true);
      try {
        const userCredential = await signInAnonymously(auth);
        await setRoleForUser(userCredential.user.uid, newRole);
      } catch (error) {
        console.error("Failed to create anonymous user:", error);
        setIsLoading(false);
      }
    }
  }, [user]);

  const logout = async () => {
    try {
      await auth.signOut();
      setRole(null);
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  useEffect(() => {
    if (!isLoading && user && role) {
      const targetPath = `/${role}/dashboard`;
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
