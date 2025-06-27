
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
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
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

export function AuthDialog({ isOpen, onOpenChange, role: initialRole, defaultTab }: AuthDialogProps) {
  const { toast } = useToast();
  const { setRoleForUser } = useUserRole();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogRole, setDialogRole] = useState<UserRole>(initialRole);

  useEffect(() => {
    setDialogRole(initialRole);
  }, [initialRole, isOpen]);

  const form = useForm<z.infer<typeof authFormSchema>>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleEmailPasswordSignUp = async (
    values: z.infer<typeof authFormSchema>
  ) => {
    if (!dialogRole) {
        toast({ title: 'Role not selected', description: 'Please select a role before signing up.', variant: 'destructive'});
        return;
    }
    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      setRoleForUser(userCredential.user.uid, dialogRole);
      toast({ title: 'Account Created!', description: 'Welcome! Redirecting you to your dashboard.' });
      onOpenChange(false);
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
      await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      toast({ title: 'Signed In Successfully!', description: 'Welcome back! Redirecting you to your dashboard.' });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Sign In Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    if (!dialogRole) {
        toast({ title: 'Role not selected', description: 'Please select a role before signing in with Google.', variant: 'destructive'});
        return;
    }
    setIsSubmitting(true);
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
        if(isNewUser) {
            setRoleForUser(result.user.uid, dialogRole);
        }
        toast({ title: 'Signed In with Google!', description: 'Welcome! Redirecting you to your dashboard.' });
        onOpenChange(false);
    } catch (error: any) {
        toast({ title: 'Google Sign-In Failed', description: error.message, variant: 'destructive'});
    } finally {
        setIsSubmitting(false);
    }
  }

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
        }
        onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome{dialogRole ? ` as a ${dialogRole}` : ''}</DialogTitle>
          <DialogDescription>
            {initialRole ? `Sign up or sign in as a ${initialRole}.` : 'Please select your role to continue.'}
          </DialogDescription>
        </DialogHeader>

        {!initialRole && (
          <RadioGroup
            value={dialogRole || ''}
            onValueChange={(value) => setDialogRole(value as UserRole)}
            className="flex space-x-4 pt-2 pb-4"
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

        <Tabs defaultValue={defaultTab || 'signin'} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
                <div className="py-4 space-y-4">
                    <AuthForm isSignUp={false} />
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
      </DialogContent>
    </Dialog>
  );
}
