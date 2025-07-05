
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Briefcase, Sparkles, Users, BarChart, Menu, Loader2, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { useState, useEffect } from "react";
import type { UserRole } from "@/types";
import { AuthDialog } from "./AuthDialog";
import { useUserRole } from "@/hooks/useUserRole";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useRouter } from "next/navigation";


export function LoginButtons() {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [defaultTab, setDefaultTab] = useState<'signin' | 'signup'>('signin');
  const [authDialogKey, setAuthDialogKey] = useState(Date.now());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { user, role, isLoading: isAuthLoading, logout, setGuestRole } = useUserRole();
  const router = useRouter();
  
  // This effect handles the initial loading screen.
  // Once authentication status is determined, it allows the page to render.
  useEffect(() => {
    if (!isAuthLoading) {
      setIsInitialLoad(false);
    }
  }, [isAuthLoading]);

  const handleAuthDialogOpen = (role: UserRole, tab: 'signin' | 'signup' = 'signup') => {
    setSelectedRole(role);
    setDefaultTab(tab);
    setIsAuthDialogOpen(true);
    setAuthDialogKey(Date.now()); // Reset dialog state if it was open before
    setIsMobileMenuOpen(false); // Close mobile menu if open
  };

  const handleGuestPreview = async (roleToPreview: UserRole) => {
    setIsGuestLoading(true);
    const success = await setGuestRole(roleToPreview);
    if (success) {
      // The redirect will be handled by the context/listener to ensure a smooth transition
    } else {
        setIsGuestLoading(false);
    }
  };

  const homePath = "/";

  // While checking auth status or if a logged-in user is about to be redirected,
  // show a full-page loading indicator. This prevents the "flash of content".
  if (isInitialLoad || (user && !user.isAnonymous && window.location.pathname === '/')) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };


  // These components render navigation buttons that adapt to the user's authentication state.
  const DesktopNavButtons = () => {
    if (user) {
      return (
        <>
            <Button variant="ghost" asChild>
                <Link href={`/${role}/dashboard`}><LayoutDashboard className="mr-2"/>Dashboard</Link>
            </Button>
            <Button variant="outline" onClick={logout}><LogOut className="mr-2"/>Logout</Button>
            <ThemeToggle />
        </>
      )
    }
    return (
        <>
            <Button variant="ghost" asChild>
                <Link href="/about">About</Link>
            </Button>
            <Button variant="ghost" onClick={() => handleAuthDialogOpen(null, 'signin')}>Login</Button>
            <Button
                onClick={() => handleAuthDialogOpen(null, 'signup')}
                className="bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 text-primary-foreground shadow-md hover:shadow-lg hover:opacity-95 transition-all"
            >
                Sign Up
            </Button>
            <ThemeToggle />
        </>
    );
  };

  const MobileNavButtons = () => {
    if(user) {
      return (
        <div className="flex flex-col space-y-4 pt-8">
            <Button variant="outline" asChild className="w-full text-lg">
                <Link href={`/${role}/dashboard`} onClick={()=>setIsMobileMenuOpen(false)}><LayoutDashboard className="mr-2"/>Dashboard</Link>
            </Button>
            <Button variant="default" onClick={handleLogout} className="w-full text-lg"><LogOut className="mr-2"/>Logout</Button>
        </div>
      )
    }
    return (
      <div className="flex flex-col space-y-4 pt-8">
          <Button variant="ghost" asChild className="w-full text-lg">
              <Link href="/about" onClick={()=>setIsMobileMenuOpen(false)}>About</Link>
          </Button>
          <Button variant="outline" onClick={() => handleAuthDialogOpen(null, 'signin')} className="w-full text-lg">Login</Button>
          <Button
            onClick={() => handleAuthDialogOpen(null, 'signup')}
            className="w-full text-lg bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 text-primary-foreground shadow-md hover:shadow-lg hover:opacity-95 transition-all"
          >
            Sign Up
          </Button>
      </div>
    );
  };


  return (
    <>
      <Card className="w-full min-h-screen shadow-none rounded-none flex flex-col bg-card">
        <nav className="p-4 border-b border-border/70 sticky top-0 bg-card z-10">
          <div className="container mx-auto flex justify-between items-center">
            <Link href={homePath} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md flex items-center justify-center bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 shadow-md">
                  <span className="font-headline font-bold text-lg text-primary-foreground">
                      TT
                  </span>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center space-x-2">
                <DesktopNavButtons />
            </div>

            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Mobile Menu</SheetTitle>
                    <SheetDescription>Main navigation links for mobile.</SheetDescription>
                  </SheetHeader>
                   <MobileNavButtons />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>

        <CardHeader className="text-center p-8 md:p-12 bg-primary/5">
          <CardTitle className="text-4xl md:text-5xl font-extrabold font-headline mt-8">
            <span className="bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 text-transparent bg-clip-text [text-shadow:0_0_12px_hsl(var(--primary)/0.5)]">
              {APP_NAME}
            </span>
          </CardTitle>
          <CardDescription className="text-lg md:text-xl text-muted-foreground mt-3">
            AI-Powered Tutoring Platform
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 md:p-10 flex-grow overflow-y-auto">
          <div className="w-full max-w-2xl mx-auto space-y-12">
            <div id="role-selection-area" className="scroll-mt-20">
              <p className="text-center text-muted-foreground text-base md:text-lg mb-6">
                Take a tour of our features, or create an account to get started:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Button
                  size="lg"
                  className="w-full py-6 text-base md:text-lg rounded-lg transform transition-all hover:scale-105 focus:ring-4 focus:ring-primary/50 bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 text-primary-foreground shadow-md hover:shadow-lg hover:opacity-95"
                  onClick={() => handleGuestPreview('student')}
                  disabled={isGuestLoading}
                >
                  {isGuestLoading ? <Loader2 className="mr-3 h-6 w-6 animate-spin"/> : <GraduationCap className="mr-3 h-6 w-6 md:h-7 md-w-7" />}
                  Preview as a Student
                </Button>
                <Button
                  size="lg"
                  className="w-full py-6 text-base md:text-lg rounded-lg transform transition-all hover:scale-105 focus:ring-4 focus:ring-primary/50 bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 text-primary-foreground shadow-md hover:shadow-lg hover:opacity-95"
                  onClick={() => handleGuestPreview('teacher')}
                  disabled={isGuestLoading}
                >
                  {isGuestLoading ? <Loader2 className="mr-3 h-6 w-6 animate-spin"/> : <Briefcase className="mr-3 h-6 w-6 md:h-7 md-w-7" />}
                  Preview as a Teacher
                </Button>
              </div>
            </div>

            <div className="pt-8 border-t border-border/70">
              <h3 className="text-2xl md:text-3xl font-bold font-headline text-center mb-10 text-foreground">
                Why Choose <span className="bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 text-transparent bg-clip-text [text-shadow:0_0_12px_hsl(var(--primary)/0.5)]">{APP_NAME}</span>?
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-left md:text-center">
                {[
                  {
                    icon: Sparkles,
                    title: "AI-Powered Assistance",
                    description: "Get instant help, personalized feedback, and smart study tools tailored to your needs.",
                  },
                  {
                    icon: Users,
                    title: "Collaborative Learning",
                    description: "Connect with peers, work on projects together, and enhance your learning through teamwork.",
                  },
                  {
                    icon: BarChart,
                    title: "Track Your Progress",
                    description: "Visualize your growth, understand your strengths, and stay motivated with clear insights.",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="p-6 bg-muted/40 rounded-xl shadow-lg hover:shadow-primary/20 transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col items-center"
                  >
                    <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h4 className="text-xl font-semibold font-headline text-foreground mb-2 text-center">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground text-center">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>

        <footer className="text-center text-muted-foreground py-8 border-t border-border">
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <p className="text-sm">Empowering learning through innovation.</p>
        </footer>
      </Card>
      <AuthDialog
        key={authDialogKey}
        isOpen={isAuthDialogOpen}
        onOpenChange={setIsAuthDialogOpen}
        role={selectedRole}
        defaultTab={defaultTab}
      />
    </>
  );
}
