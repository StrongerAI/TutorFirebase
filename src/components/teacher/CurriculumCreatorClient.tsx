"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCurriculum, type CreateCurriculumInput, type CreateCurriculumOutput } from '@/ai/flows/curriculum-creator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { PenTool, BookOpen, Sparkles, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { GenAiFeaturePage } from '@/components/shared/FeaturePage';

const CreateCurriculumInputClientSchema = z.object({
  subject: z.string().min(3, { message: "Subject must be at least 3 characters." }),
  learningObjectives: z.string().min(20, { message: "Learning objectives must be at least 20 characters." }),
});

export function CurriculumCreatorClient() {
  const [result, setResult] = useState<CreateCurriculumOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<CreateCurriculumInput>({
    resolver: zodResolver(CreateCurriculumInputClientSchema),
    defaultValues: {
      subject: '',
      learningObjectives: '',
    },
  });

  const onSubmit: SubmitHandler<CreateCurriculumInput> = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await createCurriculum(data);
      setResult(response);
    } catch (error) {
      console.error("Curriculum creator error:", error);
      toast({
        title: "Error",
        description: "Failed to create curriculum. Please try again.",
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
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary"/>Subject Matter</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Introduction to Algebra, World War II History" className="text-base" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="learningObjectives"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg flex items-center gap-2"><PenTool className="w-5 h-5 text-primary"/>Learning Objectives</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List the key learning objectives for this curriculum. e.g., Students will be able to solve linear equations, understand the causes of WWII..."
                  className="min-h-[120px] text-base"
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
              Creating Curriculum...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Generate Curriculum Outline
            </>
          )}
        </Button>
      </form>
    </Form>
  );

  const resultComponent = result && (
    <div>
        <h3 className="text-xl font-semibold mb-2 font-headline">Generated Curriculum Outline</h3>
        <pre className="whitespace-pre-wrap bg-primary/5 p-4 rounded-md text-sm text-card-foreground/90 overflow-auto max-h-[400px]">
        {result.curriculumOutline}
        </pre>
    </div>
  );

  return (
    <GenAiFeaturePage
      title="AI Curriculum Creator"
      description="Automate the creation of curriculum outlines based on subject matter and learning objectives."
      icon={PenTool}
      formComponent={formComponent}
      resultComponent={resultComponent}
      isLoading={isLoading}
    />
  );
}
