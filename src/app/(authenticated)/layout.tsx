
"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { useUserRole } from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUserRole();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and there's no user, they shouldn't be here.
    // Redirect them back to the login page.
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [isLoading, user, router]);

  // If we're still loading or the user is not available yet, show a loading state.
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full">
      <AppHeader />
      <main className="flex-1 flex flex-col bg-background overflow-hidden">
        {children}
      </main>
    </div>
  );
}

    