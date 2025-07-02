
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateQuiz, type GenerateQuizInput, type GenerateQuizOutput } from '@/ai/flows/quiz-maker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ListChecks, Zap, Puzzle, Sparkles, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { GenAiFeaturePage } from '@/components/shared/FeaturePage';
import type { QuizData, QuizQuestion } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const GenerateQuizInputClientSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters." }),
  numQuestions: z.coerce.number().int().min(1, {message: "Must have at least 1 question."}).max(20, {message: "Cannot exceed 20 questions."}),
  difficulty: z.enum(['easy', 'medium', 'hard'], { required_error: "Please select a difficulty level."}),
});

export function QuizMakerClient() {
  const [result, setResult] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<GenerateQuizInput>({
    resolver: zodResolver(GenerateQuizInputClientSchema),
    defaultValues: {
      topic: '',
      numQuestions: 5,
      difficulty: 'medium',
    },
  });

  const onSubmit: SubmitHandler<GenerateQuizInput> = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response: GenerateQuizOutput = await generateQuiz(data);
      // The AI flow now returns a parsed JSON object directly.
      setResult(response);
    } catch (error) {
      console.error("Quiz maker error:", error);
      toast({
        title: "Error",
        description: "Failed to generate quiz. Please check your input or try again. The AI might have returned an invalid format.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const difficultyLevels = [
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
  ];

  const formComponent = (
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2"><Puzzle className="w-5 h-5 text-primary"/>Quiz Topic</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Photosynthesis, The American Revolution" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="numQuestions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Questions (1-20)</FormLabel>
              <FormControl>
                <Input type="number" min="1" max="20" {...field} 
                  onChange={event => field.onChange(+event.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {difficultyLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
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
              Generating Quiz...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Generate Quiz
            </>
          )}
        </Button>
      </form>
    </Form>
  );

  const resultComponent = result && result.quiz && (
    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
      {result.quiz.map((q: QuizQuestion, index: number) => (
        <Card key={index} className="bg-primary/5">
          <CardHeader>
            <CardTitle className="font-semibold text-base md:text-md">Question {index + 1}:</CardTitle>
            <CardDescription>{q.question}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm list-disc list-inside">
              {q.options.map((opt, optIndex) => (
                <li key={optIndex} className={opt === q.answer ? 'font-semibold text-green-700' : ''}>
                  {opt} {opt === q.answer ? '(Correct Answer)' : ''}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
  
  return (
    <GenAiFeaturePage
      title="AI Quiz Maker"
      description="Create diverse and engaging assessments with varying difficulty levels powered by AI."
      icon={ListChecks}
      formComponent={formComponent}
      resultComponent={resultComponent}
      isLoading={isLoading}
    />
  );
}
