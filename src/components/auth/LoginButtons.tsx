
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserRole } from "@/hooks/useUserRole";
import { GraduationCap, Briefcase, Sparkles, Users, BarChart, School } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export function LoginButtons() {
  const { login } = useUserRole();

  const features = [
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
  ];

  const handleScrollToRoleSelection = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const section = document.getElementById("role-selection-area");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Card className="w-full min-h-screen shadow-none rounded-none flex flex-col bg-card">
      <nav className="p-4 border-b border-border/70 sticky top-0 bg-card z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://placehold.co/32x32/9775FA/FFFFFF.png?text=TT"
              alt={`${APP_NAME} Logo`}
              width={32}
              height={32}
              className="rounded-md"
              data-ai-hint="logo education"
            />
            <span className="text-xl font-bold font-headline text-primary">{APP_NAME}</span>
          </Link>
          <div className="space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/about">About</Link>
            </Button>
            <Button variant="ghost" asChild>
              <a href="#role-selection-area" onClick={handleScrollToRoleSelection}>Login</a>
            </Button>
            <Button variant="default" asChild>
              <a href="#role-selection-area" onClick={handleScrollToRoleSelection}>Sign Up</a>
            </Button>
          </div>
        </div>
      </nav>

      <CardHeader className="text-center p-8 md:p-12 bg-primary/5">
        <CardTitle className="text-5xl font-extrabold font-headline text-primary mt-8">
          {APP_NAME}
        </CardTitle>
        <CardDescription className="text-xl text-muted-foreground mt-3">
          AI-Powered Tutoring Platform
        </CardDescription>
      </CardHeader>

      <CardContent className="p-8 md:p-10 flex-grow overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto space-y-12">
          <div id="role-selection-area" className="scroll-mt-20"> {/* Added scroll-mt for fixed nav offset */}
            <p className="text-center text-muted-foreground text-lg mb-6">
              Welcome! Please select your role to continue:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Button
                variant="default"
                size="lg"
                className="w-full py-6 text-lg rounded-lg transform transition-all hover:scale-105 hover:shadow-xl focus:ring-4 focus:ring-primary/50"
                onClick={() => login('student')}
              >
                <GraduationCap className="mr-3 h-7 w-7" />
                I'm a Student
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full py-6 text-lg rounded-lg border-2 border-primary text-primary hover:bg-primary/10 transform transition-all hover:scale-105 hover:shadow-xl focus:ring-4 focus:ring-primary/50"
                onClick={() => login('teacher')}
              >
                <Briefcase className="mr-3 h-7 w-7" />
                I'm a Teacher
              </Button>
            </div>
          </div>

          <div className="pt-8 border-t border-border/70">
            <h3 className="text-3xl font-bold font-headline text-center mb-10 text-foreground">
              Why Choose <span className="text-primary">{APP_NAME}</span>?
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-left md:text-center">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 bg-muted/40 rounded-xl shadow-lg hover:shadow-primary/20 transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col items-center md:block"
                >
                  <feature.icon className="h-12 w-12 text-primary mx-auto md:mx-auto mb-4" />
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
  );
}
