
"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { useUserRole } from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, isLoading } = useUserRole();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !role) {
      router.replace('/');
    }
  }, [role, isLoading, router]);

  if (isLoading || !role) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="space-y-4 p-8 rounded-lg shadow-lg bg-card">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full"> {/* Changed min-h-screen to h-screen */}
      <AppHeader />
      {/* 
        Changed flex-grow to flex-1 to make main content area take up remaining vertical space.
        Removed padding from here, individual pages or ChatInterface can manage their own padding.
        Added overflow-hidden to prevent double scrollbars if children manage their own scroll.
      */}
      <main className="flex-1 flex flex-col bg-background overflow-hidden">
        {children}
      </main>
    </div>
  );
}
