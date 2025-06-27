
"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { APP_NAME, STUDENT_NAV_ITEMS, TEACHER_NAV_ITEMS } from "@/lib/constants";
import { useUserRole } from "@/hooks/useUserRole";
import { Menu, UserCircle, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/types";
import Image from "next/image";

export function AppHeader() {
  const { role, logout } = useUserRole();
  const pathname = usePathname();

  const navItems: NavItem[] = role === 'student' ? STUDENT_NAV_ITEMS : TEACHER_NAV_ITEMS;
  const homePath = '/';

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = item.href && pathname.startsWith(item.href);
    return (
      <Link
        href={item.href!}
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-base transition-all hover:bg-muted hover:text-primary ${
            isActive ? "bg-muted text-primary font-medium" : "text-muted-foreground"
        }`}
      >
        <item.icon className="h-5 w-5" />
        {item.label}
      </Link>
    );
  };
  
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
            <SheetHeader className="p-4 border-b">
               <SheetTitle className="sr-only">Main Navigation</SheetTitle>
               <SheetDescription className="sr-only">App main navigation links</SheetDescription>
              <Link href={homePath} className="flex items-center gap-3 text-lg font-semibold">
                  <Image src="https://placehold.co/32x32/9775FA/FFFFFF.png?text=TT" alt={`${APP_NAME} Logo`} width={32} height={32} className="rounded-md" data-ai-hint="logo education" />
                  <span className="font-headline text-primary">{APP_NAME}</span>
              </Link>
            </SheetHeader>
            <nav className="grid gap-2 p-4">
              {navItems.map((item) => {
                if (item.children) {
                  return (
                    <div key={item.label} className="grid gap-1">
                      <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground">
                        <item.icon className="h-5 w-5" />
                        <span className="font-semibold text-base">{item.label}</span>
                      </div>
                      <div className="grid gap-1 pl-6">
                        {item.children.map((child) => (
                          <NavLink key={child.href} item={child} />
                        ))}
                      </div>
                    </div>
                  );
                }
                return <NavLink key={item.href} item={item} />;
              })}
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
        {navItems.map((item) => {
          if (item.children) {
            const isDropdownActive = item.children.some(child => child.href && pathname.startsWith(child.href));
            return (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`flex items-center gap-1 text-sm font-medium transition-colors h-auto p-0 hover:bg-transparent ${
                      isDropdownActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {item.label}
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-56">
                  {item.children.map((child) => (
                    <DropdownMenuItem key={child.href} asChild>
                      <Link href={child.href!} className="flex items-center gap-2 cursor-pointer">
                        <child.icon className="h-4 w-4" />
                        <span>{child.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href!}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname.startsWith(item.href!) ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground hover:text-foreground/80"
              }`}
              aria-current={pathname.startsWith(item.href!) ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
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
