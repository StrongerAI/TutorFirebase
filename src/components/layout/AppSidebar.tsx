"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { APP_NAME, STUDENT_NAV_ITEMS, TEACHER_NAV_ITEMS, COMMON_NAV_ITEMS } from '@/lib/constants';
import type { NavItem } from '@/types';
import { useUserRole } from '@/hooks/useUserRole';
import { LogOut } from 'lucide-react';
import Image from 'next/image';

export function AppSidebar() {
  const pathname = usePathname();
  const { role, logout } = useUserRole();

  const navItems: NavItem[] = role === 'student' ? STUDENT_NAV_ITEMS : TEACHER_NAV_ITEMS;

  return (
    <div className="hidden border-r bg-card md:block h-screen sticky top-0">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center border-b px-4 lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image src="https://placehold.co/32x32.png" alt="TutorTrack.ai Logo" width={32} height={32} data-ai-hint="logo education" />
            <span className="font-headline text-lg">{APP_NAME}</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 py-4">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  pathname === item.href ? 'bg-muted text-primary' : 'text-muted-foreground'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            {COMMON_NAV_ITEMS.map((item) => (
               <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  pathname === item.href ? 'bg-muted text-primary' : 'text-muted-foreground'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="mt-auto p-4 border-t">
          <Button variant="ghost" onClick={logout} className="w-full justify-start gap-2">
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
