
"use client";

import type { UserRole } from '@/types';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, type User, signInAnonymously } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface UserRoleContextType {
  user: User | null;
  role: UserRole;
  setRoleForUser: (uid: string, role: UserRole) => Promise<void>;
  setGuestRole: (role: UserRole) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const UserRoleProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setRole(userData.role as UserRole);
        } else {
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

  const setRoleForUser = useCallback(async (uid: string, newRole: UserRole) => {
    if (!newRole) return;
    try {
      const userDocRef = doc(db, "users", uid);
      await setDoc(userDocRef, { role: newRole });
      setRole(newRole); // Eagerly update role in state
    } catch (error) {
      console.error("Failed to set user role in Firestore:", error);
      toast({
        title: "Error",
        description: "Could not save user role.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const setGuestRole = useCallback(async (newRole: UserRole): Promise<boolean> => {
    if (user || !newRole) return false;

    setIsLoading(true);
    try {
      const userCredential = await signInAnonymously(auth);
      // After anonymous sign-in, the onAuthStateChanged listener will fire.
      // We then immediately set the role for this new user.
      await setRoleForUser(userCredential.user.uid, newRole);
      // The listener will pick up the user, and then the role, triggering the redirect effect.
      // Eagerly set user and role here to speed up redirect.
      setUser(userCredential.user);
      setRole(newRole);
      return true;
    } catch (error) {
      console.error("Failed to create anonymous user:", error);
      toast({
        title: "Preview Failed",
        description: "Could not start a guest session. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
        setIsLoading(false);
    }
  }, [user, toast, setRoleForUser]);

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

  return (
    <UserRoleContext.Provider value={{ user, role, setRoleForUser, setGuestRole, logout, isLoading }}>
      {children}
    </UserRoleContext.Provider>
  );
};
