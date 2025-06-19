"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserRole } from "@/hooks/useUserRole";
import { GraduationCap, Briefcase } from "lucide-react";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";

export function LoginButtons() {
  const { login } = useUserRole();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-xl overflow-hidden">
        <CardHeader className="text-center bg-primary text-primary-foreground p-8">
          <div className="flex justify-center mb-4">
            <Image src="https://placehold.co/80x80.png" alt={`${APP_NAME} Logo`} width={80} height={80} className="rounded-full" data-ai-hint="logo education" />
          </div>
          <CardTitle className="text-4xl font-headline">{APP_NAME}</CardTitle>
          <CardDescription className="text-primary-foreground/80 text-lg mt-2">
            AI-Powered Tutoring Platform
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <p className="text-center text-muted-foreground text-lg">
            Welcome! Please select your role to continue:
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Button
              variant="default"
              size="lg"
              className="w-full py-8 text-lg transform transition-all hover:scale-105 hover:shadow-lg focus:ring-4 focus:ring-primary/50"
              onClick={() => login('student')}
            >
              <GraduationCap className="mr-3 h-7 w-7" />
              I'm a Student
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full py-8 text-lg border-primary text-primary hover:bg-primary/10 transform transition-all hover:scale-105 hover:shadow-lg focus:ring-4 focus:ring-primary/50"
              onClick={() => login('teacher')}
            >
              <Briefcase className="mr-3 h-7 w-7" />
              I'm a Teacher
            </Button>
          </div>
        </CardContent>
      </Card>
      <footer className="mt-12 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
        <p className="text-sm">Empowering learning through innovation.</p>
      </footer>
    </div>
  );
}
