
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { careerCoach, type CareerCoachInput, type CareerCoachOutput } from '@/ai/flows/career-coach';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, Layers, Heart, Building, Target, Users, Sparkles, Loader2, ChevronsRight } from 'lucide-react';
import { z } from 'zod';
import { GenAiFeaturePage } from '@/components/shared/FeaturePage';

const CareerCoachInputClientSchema = z.object({
  currentSkills: z.string().min(20, { message: "Please describe your current skills (min 20 characters)." }),
  interests: z.string().min(10, { message: "Please describe your interests (min 10 characters)." }),
  workExperience: z.string().optional(),
  careerAspirations: z.string().min(10, { message: "Please describe your career aspirations (min 10 characters)." }),
  preferredWorkEnvironment: z.string().optional(),
});

const workEnvironmentOptions = [
    { value: "fast_paced_startup", label: "Fast-paced Startup" },
    { value: "stable_corporate", label: "Stable Corporate" },
    { value: "remote_first", label: "Remote-first" },
    { value: "highly_collaborative", label: "Highly Collaborative Team" },
    { value: "independent_research", label: "Independent/Research-oriented" },
    { value: "flexible_hybrid", label: "Flexible Hybrid" },
    { value: "no_preference", label: "No Strong Preference" },
];

export function CareerCoachClient() {
  const [result, setResult] = useState<CareerCoachOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<CareerCoachInput>({
    resolver: zodResolver(CareerCoachInputClientSchema),
    defaultValues: {
      currentSkills: '',
      interests: '',
      workExperience: '',
      careerAspirations: '',
      preferredWorkEnvironment: undefined,
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
          name="currentSkills"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg flex items-center gap-2"><Layers className="w-5 h-5 text-primary" />Your Current Skills</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Python programming, data analysis, project management, public speaking..."
                  className="min-h-[100px] text-base"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="interests"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg flex items-center gap-2"><Heart className="w-5 h-5 text-primary" />Your Interests & Passions</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Artificial intelligence, creative writing, solving environmental problems, video games..."
                  className="min-h-[100px] text-base"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="workExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg flex items-center gap-2"><Building className="w-5 h-5 text-primary" />Work Experience (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Briefly describe your relevant past roles or projects."
                  className="min-h-[80px] text-base"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="careerAspirations"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg flex items-center gap-2"><Target className="w-5 h-5 text-primary" />Career Aspirations</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What are your long-term career goals? What kind of impact do you want to make?"
                  className="min-h-[100px] text-base"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="preferredWorkEnvironment"
          render={({ field }) => (
            <FormItem>
                <FormLabel className="text-lg flex items-center gap-2"><Users className="w-5 h-5 text-primary"/>Preferred Work Environment (Optional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger className="text-base">
                        <SelectValue placeholder="Select your preferred environment" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {workEnvironmentOptions.map(option => (
                        <SelectItem key={option.value} value={option.value} className="text-base">
                        {option.label}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
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
          {result.suggestedCareerPaths.split('\n').map((path, index) => path.trim() && !path.startsWith("###") && <li key={index}>{path.replace(/^- /, '')}</li>)}
        </ul>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2 font-headline flex items-center gap-2"><Layers className="w-6 h-6 text-primary"/>Skills to Develop</h3>
        <ul className="list-disc list-inside space-y-1 text-card-foreground/90 bg-primary/5 p-4 rounded-md">
          {result.skillsToDevelop.split('\n').map((skill, index) => skill.trim() && !skill.startsWith("###") && <li key={index}>{skill.replace(/^- /, '')}</li>)}
        </ul>
      </div>
       <div>
        <h3 className="text-xl font-semibold mb-2 font-headline flex items-center gap-2"><ChevronsRight className="w-6 h-6 text-primary"/>Actionable Next Steps</h3>
        <ul className="list-disc list-inside space-y-1 text-card-foreground/90 bg-primary/5 p-4 rounded-md">
          {result.actionableSteps.split('\n').map((step, index) => step.trim() && !step.startsWith("###") && <li key={index}>{step.replace(/^- /, '')}</li>)}
        </ul>
      </div>
    </div>
  );

  return (
    <GenAiFeaturePage
      title="AI Career Coach"
      description="Discover career paths and skills tailored to your interests and aspirations. Let our AI guide you with actionable steps!"
      icon={Briefcase}
      formComponent={formComponent}
      resultComponent={resultComponent}
      isLoading={isLoading}
    />
  );
}
