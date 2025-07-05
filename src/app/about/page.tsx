
"use client"; // To handle mobile menu state

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { Scale, Lightbulb, GraduationCap, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export default function AboutPage() {
    const homePath = "/";
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <nav className="p-4 border-b border-border/70 sticky top-0 bg-card z-10">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href={homePath} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md flex items-center justify-center bg-card border">
                        <span className="font-headline font-bold text-lg bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 text-transparent bg-clip-text [text-shadow:0_0_8px_hsl(var(--primary)/0.5)]">
                            TT
                        </span>
                    </div>
                    </Link>
                    
                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-2">
                        <Button variant="ghost" asChild>
                            <Link href="/">Login</Link>
                        </Button>
                        <Button variant="default" asChild>
                            <Link href="/">Sign Up</Link>
                        </Button>
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
                                 <Button variant="outline" asChild className="w-full text-lg">
                                    <Link href="/" onClick={()=>setIsMobileMenuOpen(false)}>Login</Link>
                                </Button>
                                 <Button variant="default" asChild className="w-full text-lg">
                                    <Link href="/" onClick={()=>setIsMobileMenuOpen(false)}>Sign Up</Link>
                                 </Button>
                            </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </nav>

            <main className="flex-grow container mx-auto p-6 md:p-12">
                <Card className="max-w-4xl mx-auto shadow-xl rounded-xl">
                    <CardHeader className="text-center p-8 bg-primary/5">
                        <CardTitle className="text-3xl md:text-4xl font-extrabold font-headline text-primary">
                            About
                        </CardTitle>
                        <CardDescription className="text-base md:text-lg text-muted-foreground mt-2">
                            Pioneering the Future of Personalized Education
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-8 md:p-10 space-y-10">
                        <section>
                            <h2 className="text-2xl font-bold font-headline mb-3">Our Objective</h2>
                            <p className="text-muted-foreground leading-relaxed text-base">
                                At {APP_NAME}, we are driven by a singular goal: to democratize personalized education for every learner and educator on the planet. We envision a world where the constraints of traditional learning environments are dissolved, replaced by an intelligent, adaptive, and deeply engaging ecosystem powered by artificial intelligence. Our objective is not merely to build tools, but to cultivate a global community where potential is unbound, curiosity is the primary currency, and every individual has the resources to achieve their highest aspirations.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold font-headline mb-5">Our Core Values</h2>
                            <div className="grid md:grid-cols-3 gap-6 text-center">
                                <div className="p-6 bg-muted/40 rounded-xl flex flex-col items-center">
                                    <Scale className="h-8 w-8 text-primary mb-3" />
                                    <h3 className="text-lg font-semibold font-headline mb-2">Integrity</h3>
                                    <p className="text-sm text-muted-foreground">We operate with unwavering ethical standards, ensuring our AI is a force for good, promoting fairness, transparency, and academic honesty.</p>
                                </div>
                                <div className="p-6 bg-muted/40 rounded-xl flex flex-col items-center">
                                    <Lightbulb className="h-8 w-8 text-primary mb-3" />
                                    <h3 className="text-lg font-semibold font-headline mb-2">Innovation</h3>
                                    <p className="text-sm text-muted-foreground">We relentlessly pursue technological advancement, pushing the boundaries of what's possible in educational AI to create transformative learning experiences.</p>
                                </div>
                                <div className="p-6 bg-muted/40 rounded-xl flex flex-col items-center">
                                    <GraduationCap className="h-8 w-8 text-primary mb-3" />
                                    <h3 className="text-lg font-semibold font-headline mb-2">Empowerment</h3>
                                    <p className="text-sm text-muted-foreground">We are committed to empowering both students and teachers, providing intelligent tools that amplify their abilities and foster a lifelong love of learning.</p>
                                </div>
                            </div>
                        </section>

                        <section className="text-center pt-6 border-t border-border/70">
                             <h2 className="text-2xl font-bold font-headline mb-3">Connect With Us</h2>
                             <p className="text-muted-foreground text-base max-w-2xl mx-auto">
                                We are building the future of education, and we invite you to be a part of our journey. For inquiries, partnerships, or to share your vision, please reach out to us.
                             </p>
                             <a href="mailto:letsconnect@tutortrack.ai" className="mt-4 inline-block text-base font-semibold text-primary hover:underline">
                                letsconnect@tutortrack.ai
                             </a>
                        </section>
                    </CardContent>
                </Card>
            </main>

            <footer className="text-center text-muted-foreground py-8 border-t border-border">
                <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
                <p className="text-sm">Empowering learning through innovation.</p>
            </footer>
        </div>
    );
}
