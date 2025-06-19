"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
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
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <AppSidebar />
      <div className="flex flex-col">
        <AppHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
