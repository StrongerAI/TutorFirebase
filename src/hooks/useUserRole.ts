
"use client";

import { UserRoleContext } from '@/context/UserRoleContext';
import { useContext } from 'react';

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};
