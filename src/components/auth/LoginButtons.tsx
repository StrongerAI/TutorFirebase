
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserRole } from "@/hooks/useUserRole";
import { GraduationCap, Briefcase, Sparkles, Users, BarChart } from "lucide-react";
import Image from "next/image";
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 p-4">
      <Card className="w-full max-w-xl shadow-2xl rounded-2xl overflow-hidden bg-card">
        <CardHeader className="text-center p-8 md:p-12 bg-primary/5">
          <Image
            src="https://placehold.co/100x100/9775FA/FFFFFF.png?text=TT"
            alt={`${APP_NAME} Logo`}
            width={100}
            height={100}
            className="rounded-full mx-auto mb-6 border-4 border-primary/30 shadow-lg"
            data-ai-hint="modern education logo"
          />
          <CardTitle className="text-5xl font-extrabold font-headline text-primary">
            {APP_NAME}
          </CardTitle>
          <CardDescription className="text-xl text-muted-foreground mt-3">
            AI-Powered Tutoring Platform
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 md:p-10 space-y-8">
          <div>
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

          <div className="mt-12 pt-8 border-t border-border/70">
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
        </CardContent>
      </Card>
      <footer className="mt-12 text-center text-muted-foreground pb-8">
        <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
        <p className="text-sm">Empowering learning through innovation.</p>
      </footer>
    </div>
  );
}
