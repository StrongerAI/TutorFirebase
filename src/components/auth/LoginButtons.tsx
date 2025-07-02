
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Briefcase, Sparkles, Users, BarChart, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { useState } from "react";
import type { UserRole } from "@/types";
import { AuthDialog } from "./AuthDialog";
import { useUserRole } from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";

export function LoginButtons() {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [defaultTab, setDefaultTab] = useState<'signin' | 'signup'>('signin');
  const [authDialogKey, setAuthDialogKey] = useState(Date.now());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { setGuestRole } = useUserRole();
  const router = useRouter();

  const handleAuthDialogOpen = (role: UserRole, tab: 'signin' | 'signup' = 'signup') => {
    setSelectedRole(role);
    setDefaultTab(tab);
    setIsAuthDialogOpen(true);
    setAuthDialogKey(Date.now()); // Reset dialog state if it was open before
    setIsMobileMenuOpen(false); // Close mobile menu if open
  };

  const handleGuestPreview = (role: UserRole) => {
    if (role) {
      setGuestRole(role);
      router.push(`/${role}/dashboard`);
    }
  };

  const homePath = "/";

  return (
    <>
      <Card className="w-full min-h-screen shadow-none rounded-none flex flex-col bg-card">
        <nav className="p-4 border-b border-border/70 sticky top-0 bg-card z-10">
          <div className="container mx-auto flex justify-between items-center">
            <Link href={homePath} className="flex items-center gap-2">
              <Image
                src="https://placehold.co/32x32/9775FA/FFFFFF.png?text=TT"
                alt={`${APP_NAME} Logo`}
                width={32}
                height={32}
                className="rounded-md"
                data-ai-hint="logo education"
              />
              <span className="text-xl font-bold font-headline text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary">{APP_NAME}</span>
            </Link>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/about">About</Link>
              </Button>
              <Button variant="ghost" onClick={() => handleAuthDialogOpen(null, 'signin')}>Login</Button>
              <Button variant="default" onClick={() => handleAuthDialogOpen(null, 'signup')}>Sign Up</Button>
            </div>

            {/* Mobile Nav */}
            <div className="md:hidden">
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
                   <div className="flex flex-col space-y-4 pt-8">
                     <Button variant="ghost" asChild className="w-full text-lg">
                        <Link href="/about" onClick={()=>setIsMobileMenuOpen(false)}>About</Link>
                      </Button>
                      <Button variant="outline" onClick={() => handleAuthDialogOpen(null, 'signin')} className="w-full text-lg">Login</Button>
                      <Button variant="default" onClick={() => handleAuthDialogOpen(null, 'signup')} className="w-full text-lg">Sign Up</Button>
                   </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>

        <CardHeader className="text-center p-8 md:p-12 bg-primary/5">
          <CardTitle className="text-4xl md:text-5xl font-extrabold font-headline text-primary mt-8">
            {APP_NAME}
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
                  variant="default"
                  size="lg"
                  className="w-full py-6 text-base md:text-lg rounded-lg transform transition-all hover:scale-105 hover:shadow-xl focus:ring-4 focus:ring-primary/50"
                  onClick={() => handleGuestPreview('student')}
                >
                  <GraduationCap className="mr-3 h-6 w-6 md:h-7 md:w-7" />
                  Preview as a Student
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full py-6 text-base md:text-lg rounded-lg border-2 border-primary text-primary hover:bg-primary/10 transform transition-all hover:scale-105 hover:shadow-xl focus:ring-4 focus:ring-primary/50"
                  onClick={() => handleGuestPreview('teacher')}
                >
                  <Briefcase className="mr-3 h-6 w-6 md:h-7 md:w-7" />
                  Preview as a Teacher
                </Button>
              </div>
            </div>

            <div className="pt-8 border-t border-border/70">
              <h3 className="text-2xl md:text-3xl font-bold font-headline text-center mb-10 text-foreground">
                Why Choose <span className="text-primary">{APP_NAME}</span>?
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
