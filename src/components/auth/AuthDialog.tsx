
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  linkWithCredential,
  EmailAuthProvider,
  linkWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { UserRole } from '@/types';
import { useUserRole } from '@/hooks/useUserRole';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

interface AuthDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  role: UserRole;
  defaultTab?: 'signin' | 'signup';
}

const authFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long.' }),
});

const resetSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
});

export function AuthDialog({ isOpen, onOpenChange, role: initialRole, defaultTab }: AuthDialogProps) {
  const { toast } = useToast();
  const { setRoleForUser } = useUserRole();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogRole, setDialogRole] = useState<UserRole>(initialRole);
  const [view, setView] = useState<'auth' | 'reset'>('auth');
  const [activeTab, setActiveTab] = useState(defaultTab || 'signin');
  const router = useRouter();

  useEffect(() => {
    setDialogRole(initialRole);
    if(isOpen) {
        setView('auth'); // Reset to auth view when dialog opens
        setActiveTab(defaultTab || 'signin');
    }
  }, [initialRole, isOpen, defaultTab]);

  const form = useForm<z.infer<typeof authFormSchema>>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleEmailPasswordSignUp = async (
    values: z.infer<typeof authFormSchema>
  ) => {
    setIsSubmitting(true);
    const currentUser = auth.currentUser;

    try {
      if (currentUser && currentUser.isAnonymous) {
        const credential = EmailAuthProvider.credential(values.email, values.password);
        await linkWithCredential(currentUser, credential);
        await sendEmailVerification(currentUser);
        toast({ title: 'Account Upgraded!', description: 'Your guest session has been saved. Please verify your email.' });
        onOpenChange(false);
      } else {
        if (!dialogRole) {
            toast({ title: 'Role not selected', description: 'Please select a role before signing up.', variant: 'destructive'});
            setIsSubmitting(false);
            return;
        }
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        await sendEmailVerification(userCredential.user);
        await setRoleForUser(userCredential.user.uid, dialogRole);
        toast({ title: 'Account Created!', description: 'A verification link has been sent to your email.' });
        onOpenChange(false);
      }
    } catch (error: any) {
      toast({
        title: 'Sign Up Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleEmailPasswordSignIn = async (
    values: z.infer<typeof authFormSchema>
  ) => {
    setIsSubmitting(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const role = userDoc.data().role as UserRole;
        toast({ title: 'Signed In Successfully!', description: 'Welcome back! Redirecting...' });
        router.push(`/${role}/dashboard`);
        onOpenChange(false);
      } else {
        await auth.signOut();
        toast({ title: 'Sign In Failed', description: 'Your account profile is incomplete. Please sign up again.', variant: 'destructive' });
      }
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          toast({ title: 'Sign In Failed', description: 'Invalid email or password.', variant: 'destructive'});
      } else {
          toast({ title: 'Sign In Failed', description: error.message, variant: 'destructive' });
      }
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    const provider = new GoogleAuthProvider();

    try {
        const result = await signInWithPopup(auth, provider);
        const userDocRef = doc(db, 'users', result.user.uid);
        const userDoc = await getDoc(userDocRef);

        let role: UserRole = null;

        if (userDoc.exists()) {
            role = userDoc.data().role as UserRole;
        } else {
            if (activeTab === 'signup' && dialogRole) {
                await setRoleForUser(result.user.uid, dialogRole);
                role = dialogRole;
            } else {
                await auth.signOut();
                toast({
                    title: 'Account Not Found',
                    description: 'Please go to the "Sign Up" tab, select a role, and then sign up with Google.',
                    variant: 'destructive',
                    duration: 5000,
                });
                setIsSubmitting(false);
                return;
            }
        }

        if (role) {
            toast({ title: 'Signed In with Google!', description: 'Welcome! Redirecting...' });
            router.push(`/${role}/dashboard`);
            onOpenChange(false);
        } else {
            toast({ title: 'Sign In Failed', description: 'Could not determine user role.', variant: 'destructive' });
        }
    } catch (error: any) {
        toast({ title: 'Google Sign-In Failed', description: error.message, variant: 'destructive'});
        setIsSubmitting(false);
    }
    // No finally block needed here as all paths handle isSubmitting
  }

  const handlePasswordReset = async (values: z.infer<typeof resetSchema>) => {
    setIsSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, values.email);
      toast({
        title: 'Password Reset Email Sent',
        description: 'Please check your inbox for instructions to reset your password.',
      });
      setView('auth');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const AuthForm = ({ isSignUp }: { isSignUp: boolean }) => (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          isSignUp ? handleEmailPasswordSignUp : handleEmailPasswordSignIn
        )}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
        </Button>
      </form>
    </Form>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if(!open) {
            form.reset();
            resetForm.reset();
        }
        onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        {view === 'auth' ? (
        <>
            <DialogHeader>
                <DialogTitle>
                {activeTab === 'signin' ? 'Welcome Back' : 'Create an Account'}
                </DialogTitle>
                <DialogDescription>
                {activeTab === 'signin'
                    ? 'Sign in to access your dashboard.'
                    : 'Select your role and create an account to get started.'}
                </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue={defaultTab || 'signin'} onValueChange={(tab) => setActiveTab(tab as 'signin' | 'signup')} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                    <div className="py-4 space-y-4">
                        <AuthForm isSignUp={false} />
                         <Button variant="link" className="p-0 h-auto font-normal text-sm" onClick={() => setView('reset')}>
                            Forgot Password?
                        </Button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                                </span>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isSubmitting}>
                        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.62-4.55 1.62-3.87 0-7-3.13-7-7s3.13-7 7-7c2.18 0 3.66.86 4.6 1.78l2.74-2.74C18.77 1.69 16.2.5 12.48.5 5.8 0 0 5.8 0 12.5s5.8 12.5 12.48 12.5c7.22 0 12-5.04 12-12.24 0-.76-.07-1.5-.2-2.24H12.48z"/></svg>
                            Sign in with Google
                        </Button>
                    </div>
                </TabsContent>
                <TabsContent value="signup">
                    <div className="py-4 space-y-4">
                        {!initialRole && (
                            <RadioGroup
                                value={dialogRole || ''}
                                onValueChange={(value) => setDialogRole(value as UserRole)}
                                className="flex space-x-4"
                            >
                                <div className="flex items-center space-x-2">
                                <RadioGroupItem value="student" id="role-student-dialog" />
                                <Label htmlFor="role-student-dialog" className="font-normal cursor-pointer">
                                    I'm a Student
                                </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                <RadioGroupItem value="teacher" id="role-teacher-dialog" />
                                <Label htmlFor="role-teacher-dialog" className="font-normal cursor-pointer">
                                    I'm a Teacher
                                </Label>
                                </div>
                            </RadioGroup>
                        )}
                        <AuthForm isSignUp={true} />
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                Or sign up with
                                </span>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isSubmitting}>
                        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.62-4.55 1.62-3.87 0-7-3.13-7-7s3.13-7 7-7c2.18 0 3.66.86 4.6 1.78l2.74-2.74C18.77 1.69 16.2.5 12.48.5 5.8 0 0 5.8 0 12.5s5.8 12.5 12.48 12.5c7.22 0 12-5.04 12-12.24 0-.76-.07-1.5-.2-2.24H12.48z"/></svg>
                            Sign up with Google
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </>
        ) : (
            <div className="space-y-4">
                <DialogHeader className="text-left">
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogDescription>
                        Enter your email address to receive a password reset link.
                    </DialogDescription>
                </DialogHeader>
                <Form {...resetForm}>
                    <form onSubmit={resetForm.handleSubmit(handlePasswordReset)} className="space-y-4 pt-4">
                        <FormField
                            control={resetForm.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="you@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
                        </Button>
                    </form>
                </Form>
                <Button variant="link" className="p-0 h-auto font-normal text-sm" onClick={() => setView('auth')}>
                    &larr; Back to Sign In
                </Button>
            </div>
        )}

      </DialogContent>
    </Dialog>
  );
}
