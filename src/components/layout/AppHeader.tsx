
"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { APP_NAME, STUDENT_NAV_ITEMS, TEACHER_NAV_ITEMS } from "@/lib/constants";
import { useUserRole } from "@/hooks/useUserRole";
import { Menu, UserCircle, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/types";
import Image from "next/image";

export function AppHeader() {
  const { role, logout } = useUserRole();
  const pathname = usePathname();

  const navItems: NavItem[] = role === 'student' ? STUDENT_NAV_ITEMS : TEACHER_NAV_ITEMS;
  const homePath = role === 'student' ? '/student/dashboard' : '/teacher/dashboard';

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b bg-card px-4 md:px-6 sticky top-0 z-30">
      {/* Left Group: Mobile Nav Trigger & Logo/App Name */}
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0 w-[280px] bg-card">
            <Link href={homePath} className="flex items-center gap-3 text-lg font-semibold p-4 border-b">
                <Image src="https://placehold.co/32x32/9775FA/FFFFFF.png?text=TT" alt={`${APP_NAME} Logo`} width={32} height={32} className="rounded-md" data-ai-hint="logo education" />
            </Link>
            <nav className="grid gap-1 p-4">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-base transition-all hover:bg-muted hover:text-primary ${
                            pathname === item.href ? "bg-muted text-primary font-medium" : "text-muted-foreground"
                        }`}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </Link>
                ))}
            </nav>
            <div className="mt-auto p-4 border-t">
              <Button variant="ghost" onClick={logout} className="w-full justify-start gap-3 text-base px-3 py-2.5">
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <Link href={homePath} className="hidden md:flex items-center gap-2">
            <Image src="https://placehold.co/32x32/9775FA/FFFFFF.png?text=TT" alt={`${APP_NAME} Logo`} width={28} height={28} className="rounded-md" data-ai-hint="logo education" />
        </Link>
      </div>

      {/* Center Group: Centered Nav Links for Desktop */}
      <nav className="hidden md:flex flex-grow items-center justify-center gap-x-5 lg:gap-x-8">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname.startsWith(item.href) ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground hover:text-foreground/80"
            }`}
            aria-current={pathname.startsWith(item.href) ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Right Group: User Menu */}
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
              <UserCircle className="h-6 w-6 text-muted-foreground hover:text-primary" />
              <span className="sr-only">Open user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">My Account</p>
                <p className="text-xs leading-none text-muted-foreground capitalize">
                  {role}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* You can add more items here like "Settings", "Profile" etc. */}
            {/* Example:
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            */}
            <DropdownMenuItem onClick={logout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
