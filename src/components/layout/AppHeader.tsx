"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { APP_NAME } from "@/lib/constants";
import { useUserRole } from "@/hooks/useUserRole";
import { Menu, UserCircle, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/types";
import { STUDENT_NAV_ITEMS, TEACHER_NAV_ITEMS } from "@/lib/constants";
import Image from "next/image";

interface AppHeaderProps {
  pageTitle?: string;
}

export function AppHeader({ pageTitle }: AppHeaderProps) {
  const { role, logout } = useUserRole();
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pageTitle) return pageTitle;
    const navItems = role === 'student' ? STUDENT_NAV_ITEMS : TEACHER_NAV_ITEMS;
    const currentNavItem = findNavItem(navItems, pathname);
    return currentNavItem ? currentNavItem.label : APP_NAME;
  };
  
  const findNavItem = (items: NavItem[], path: string): NavItem | null => {
    for (const item of items) {
      if (item.href === path) return item;
      if (item.children) {
        const childMatch = findNavItem(item.children, path);
        if (childMatch) return childMatch;
      }
    }
    return null;
  };

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0">
            {/* Mobile Sidebar Content can be placed here or use the main AppSidebar logic */}
            <nav className="grid gap-2 text-lg font-medium p-4">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold mb-4">
                    <Image src="https://placehold.co/32x32.png" alt="TutorTrack.ai Logo" width={32} height={32} data-ai-hint="logo education" />
                    <span className="font-headline">{APP_NAME}</span>
                </Link>
                {(role === 'student' ? STUDENT_NAV_ITEMS : TEACHER_NAV_ITEMS).map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                            pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground"
                        }`}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </Link>
                ))}
            </nav>
            <div className="mt-auto p-4 border-t">
              <Button variant="ghost" onClick={logout} className="w-full justify-start gap-2">
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
         <h1 className="text-xl font-semibold md:text-2xl font-headline">{getPageTitle()}</h1>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground capitalize hidden sm:inline">
          {role}
        </span>
        <UserCircle className="h-6 w-6 text-muted-foreground" />
      </div>
    </header>
  );
}
