
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assignmentHelp, type AssignmentHelpInput, type AssignmentHelpOutput } from '@/ai/flows/assignment-help';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { HelpCircle, BookOpen, Lightbulb, Sparkles, Loader2, Info, Tag } from 'lucide-react';
import { z } from 'zod';
import { GenAiFeaturePage } from '@/components/shared/FeaturePage';

const AssignmentHelpInputClientSchema = z.object({
  assignmentDetails: z.string().min(30, { message: "Please provide detailed information about your assignment (min 30 characters)." }),
  studentLevel: z.string({ required_error: "Please select your student level." }),
  subject: z.string().optional(),
  specificQuestion: z.string().optional(),
});

export function AssignmentHelpClient() {
  const [result, setResult] = useState<AssignmentHelpOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<AssignmentHelpInput>({
    resolver: zodResolver(AssignmentHelpInputClientSchema),
    defaultValues: {
      assignmentDetails: '',
      studentLevel: undefined,
      subject: '',
      specificQuestion: '',
    },
  });

  const onSubmit: SubmitHandler<AssignmentHelpInput> = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await assignmentHelp(data);
      setResult(response);
    } catch (error) {
      console.error("Assignment help error:", error);
      toast({
        title: "Error",
        description: "Failed to get assignment help. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const studentLevels = [
    { value: "middle_school", label: "Middle School" },
    { value: "high_school", label: "High School" },
    { value: "undergraduate", label: "Undergraduate" },
    { value: "graduate", label: "Graduate" },
    { value: "other", label: "Other" },
  ];

  const formComponent = (
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="assignmentDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg flex items-center gap-2"><Info className="w-5 h-5 text-primary"/>Assignment Details</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your assignment, including instructions, context, and specific problems you're facing..."
                  className="min-h-[120px] text-base"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="studentLevel"
            render={({ field }) => (
                <FormItem>
                <FormLabel className="text-lg">Your Student Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger className="text-base">
                        <SelectValue placeholder="Select your academic level" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {studentLevels.map(level => (
                        <SelectItem key={level.value} value={level.value} className="text-base">
                        {level.label}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
                <FormItem>
                <FormLabel className="text-lg flex items-center gap-2"><Tag className="w-5 h-5 text-primary"/>Subject/Topic (Optional)</FormLabel>
                <FormControl>
                    <Input
                    placeholder="e.g., Calculus, World History"
                    className="text-base"
                    {...field}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="specificQuestion"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Specific Question (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., How do I approach question 3?"
                  className="text-base"
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
              Getting Help...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Get AI Assistance
            </>
          )}
        </Button>
      </form>
    </Form>
  );

  const resultComponent = result && (
    <div className="space-y-6">
        <div>
            <h3 className="text-xl font-semibold mb-2 font-headline flex items-center gap-2"><BookOpen className="w-6 h-6 text-primary"/>Explanation</h3>
            <p className="text-card-foreground/90 whitespace-pre-wrap bg-primary/5 p-4 rounded-md">{result.explanation}</p>
        </div>
        <div>
            <h3 className="text-xl font-semibold mb-2 font-headline flex items-center gap-2"><Sparkles className="w-6 h-6 text-primary"/>Suggestions</h3>
            <p className="text-card-foreground/90 whitespace-pre-wrap bg-primary/5 p-4 rounded-md">{result.suggestions}</p>
        </div>
        {result.hint && (
            <div>
            <h3 className="text-xl font-semibold mb-2 font-headline flex items-center gap-2"><Lightbulb className="w-6 h-6 text-primary"/>Hint</h3>
            <p className="text-card-foreground/90 whitespace-pre-wrap bg-primary/5 p-4 rounded-md">{result.hint}</p>
            </div>
        )}
    </div>
  );

  return (
    <GenAiFeaturePage
      title="AI Assignment Helper"
      description="Get explanations, suggestions, and guidance for your assignments. Now with subject-specific help!"
      icon={HelpCircle}
      formComponent={formComponent}
      resultComponent={resultComponent}
      isLoading={isLoading}
    />
  );
}
