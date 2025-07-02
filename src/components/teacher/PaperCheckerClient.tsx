
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { analyzeAndGradePaper, type AnalyzeAndGradePaperInput, type AnalyzeAndGradePaperOutput } from '@/ai/flows/paper-checker';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { FileText, ClipboardList, Info, Sparkles, Loader2, Award, MessageSquare, ListChecks } from 'lucide-react';
import { z } from 'zod';
import { GenAiFeaturePage } from '@/components/shared/FeaturePage';

const PaperCheckerInputClientSchema = z.object({
  paperText: z.string().min(100, { message: "Paper text must be at least 100 characters." }),
  assignmentInstructions: z.string().min(20, { message: "Assignment instructions must be at least 20 characters." }),
  gradingRubric: z.string().min(20, { message: "Grading rubric must be at least 20 characters." }),
  additionalContext: z.string().optional(),
});

export function PaperCheckerClient() {
  const [result, setResult] = useState<AnalyzeAndGradePaperOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<AnalyzeAndGradePaperInput>({
    resolver: zodResolver(PaperCheckerInputClientSchema),
    defaultValues: {
      paperText: '',
      assignmentInstructions: '',
      gradingRubric: '',
      additionalContext: '',
    },
  });

  const onSubmit: SubmitHandler<AnalyzeAndGradePaperInput> = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await analyzeAndGradePaper(data);
      setResult(response);
    } catch (error) {
      console.error("Paper checker error:", error);
      toast({
        title: "Error",
        description: "Failed to analyze paper. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const formComponent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="paperText"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2"><FileText className="w-5 h-5 text-primary"/>Student Paper Text</FormLabel>
              <FormControl>
                <Textarea placeholder="Paste the student's paper text here..." className="min-h-[150px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="assignmentInstructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2"><ClipboardList className="w-5 h-5 text-primary"/>Assignment Instructions</FormLabel>
              <FormControl>
                <Textarea placeholder="Provide the assignment instructions..." className="min-h-[80px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gradingRubric"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2"><ListChecks className="w-5 h-5 text-primary"/>Grading Rubric</FormLabel>
              <FormControl>
                <Textarea placeholder="Detail the grading rubric or criteria..." className="min-h-[80px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="additionalContext"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2"><Info className="w-5 h-5 text-primary"/>Additional Context (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Any other relevant information..." className="min-h-[60px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full text-lg py-6 mt-2" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Analyzing Paper...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Analyze and Grade
            </>
          )}
        </Button>
      </form>
    </Form>
  );

  const resultComponent = result && (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1 font-headline flex items-center gap-2"><Award className="w-5 h-5 text-primary"/>Grade</h3>
        <p className="text-2xl font-bold text-primary bg-primary/5 p-3 rounded-md">{result.grade}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-1 font-headline flex items-center gap-2"><MessageSquare className="w-5 h-5 text-primary"/>Feedback</h3>
        <p className="text-card-foreground/90 whitespace-pre-wrap bg-primary/5 p-3 rounded-md">{result.feedback}</p>
      </div>
      {result.scoreBreakdown && (
        <div>
          <h3 className="text-lg font-semibold mb-1 font-headline flex items-center gap-2"><ListChecks className="w-5 h-5 text-primary"/>Score Breakdown</h3>
          <p className="text-card-foreground/90 whitespace-pre-wrap bg-primary/5 p-3 rounded-md">{result.scoreBreakdown}</p>
        </div>
      )}
      {result.suggestions && (
        <div>
          <h3 className="text-lg font-semibold mb-1 font-headline flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary"/>Suggestions</h3>
          <p className="text-card-foreground/90 whitespace-pre-wrap bg-primary/5 p-3 rounded-md">{result.suggestions}</p>
        </div>
      )}
    </div>
  );
  
  return (
    <GenAiFeaturePage
      title="AI Paper Checker"
      description="Analyze, assess, and grade student papers efficiently with AI assistance."
      icon={FileText}
      formComponent={formComponent}
      resultComponent={resultComponent}
      isLoading={isLoading}
    />
  );
}
