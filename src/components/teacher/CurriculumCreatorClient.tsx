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
import { PenTool, BookOpen, Sparkles, Loader2, List, Activity } from 'lucide-react';
import { z } from 'zod';
import { GenAiFeaturePage } from '@/components/shared/FeaturePage';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

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
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold font-headline">{result.title}</h2>
        <p className="text-muted-foreground mt-2">{result.description}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 font-headline">Key Learning Objectives</h3>
        <div className="flex flex-wrap gap-2">
            {result.learning_objectives.map((obj, i) => (
                <Badge key={i} variant="secondary" className="text-sm">{obj}</Badge>
            ))}
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
        {result.modules.map((module, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-lg font-semibold">
              Module {module.moduleNumber}: {module.moduleTitle}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-md"><List className="w-4 h-4 text-primary"/>Topics Covered</h4>
                    <ul className="list-disc list-inside space-y-1 pl-2 text-muted-foreground">
                      {module.topics.map((topic, i) => <li key={i}>{topic}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-md"><Activity className="w-4 h-4 text-primary"/>Suggested Activities</h4>
                    <ul className="list-disc list-inside space-y-1 pl-2 text-muted-foreground">
                      {module.activities.map((activity, i) => <li key={i}>{activity}</li>)}
                    </ul>
                  </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
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
