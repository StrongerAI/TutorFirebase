"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { careerCoach, type CareerCoachInput, type CareerCoachOutput } from '@/ai/flows/career-coach';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, Brain, Sparkles, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { GenAiFeaturePage } from '@/components/shared/FeaturePage';

// Re-define schema for client-side validation consistency if needed, or import if identical
const CareerCoachInputClientSchema = z.object({
  skillsAndInterests: z.string().min(20, { message: "Please describe your skills and interests in at least 20 characters." }),
});

export function CareerCoachClient() {
  const [result, setResult] = useState<CareerCoachOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<CareerCoachInput>({
    resolver: zodResolver(CareerCoachInputClientSchema),
    defaultValues: {
      skillsAndInterests: '',
    },
  });

  const onSubmit: SubmitHandler<CareerCoachInput> = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await careerCoach(data);
      setResult(response);
    } catch (error) {
      console.error("Career coach error:", error);
      toast({
        title: "Error",
        description: "Failed to get career advice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formComponent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="skillsAndInterests"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg flex items-center gap-2"><Brain className="w-5 h-5 text-primary" />Your Skills and Interests</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Passionate about coding, love solving complex problems, enjoy creative writing and teamwork..."
                  className="min-h-[150px] text-base"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Get Career Advice
            </>
          )}
        </Button>
      </form>
    </Form>
  );

  const resultComponent = result && (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2 font-headline flex items-center gap-2"><Briefcase className="w-6 h-6 text-primary" />Suggested Career Paths</h3>
        <ul className="list-disc list-inside space-y-1 text-card-foreground/90 bg-primary/5 p-4 rounded-md">
          {result.suggestedCareerPaths.split('\n').map((path, index) => path.trim() && <li key={index}>{path.replace(/^- /, '')}</li>)}
        </ul>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2 font-headline flex items-center gap-2"><Brain className="w-6 h-6 text-primary"/>Skills to Develop</h3>
        <ul className="list-disc list-inside space-y-1 text-card-foreground/90 bg-primary/5 p-4 rounded-md">
          {result.skillsToDevelop.split('\n').map((skill, index) => skill.trim() && <li key={index}>{skill.replace(/^- /, '')}</li>)}
        </ul>
      </div>
    </div>
  );

  return (
    <GenAiFeaturePage
      title="AI Career Coach"
      description="Discover career paths and skills tailored to your interests. Let our AI guide you!"
      icon={Briefcase}
      formComponent={formComponent}
      resultComponent={resultComponent}
      isLoading={isLoading}
    />
  );
}
