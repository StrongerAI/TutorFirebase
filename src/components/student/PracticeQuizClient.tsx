
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
import { ClipboardCheck, Puzzle, Sparkles, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { z } from 'zod';
import { GenAiFeaturePage } from '@/components/shared/FeaturePage';
import type { QuizData, QuizQuestion } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const GenerateQuizInputClientSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters." }),
  numQuestions: z.coerce.number().int().min(1, {message: "Must have at least 1 question."}).max(10, {message: "Cannot exceed 10 questions for a practice quiz."}),
  difficulty: z.enum(['easy', 'medium', 'hard'], { required_error: "Please select a difficulty level."}),
});

// To track student's answers
type StudentAnswers = { [questionIndex: number]: string };

export function PracticeQuizClient() {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswers>({});
  const { toast } = useToast();

  const form = useForm<GenerateQuizInput>({
    resolver: zodResolver(GenerateQuizInputClientSchema),
    defaultValues: {
      topic: '',
      numQuestions: 5,
      difficulty: 'medium',
    },
  });

  const handleGenerateQuiz: SubmitHandler<GenerateQuizInput> = async (data) => {
    setIsLoading(true);
    setQuizData(null);
    setIsSubmitted(false);
    setStudentAnswers({});
    try {
      const response: GenerateQuizOutput = await generateQuiz(data);
      setQuizData(response);
    } catch (error) {
      console.error("Quiz generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate quiz. Please check your input or try again. The AI might have returned an invalid format.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setStudentAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };
  
  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
  };

  const difficultyLevels = [
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
  ];

  const formComponent = (
     <Form {...form}>
      <form onSubmit={form.handleSubmit(handleGenerateQuiz)} className="space-y-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="numQuestions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Questions (1-10)</FormLabel>
                <FormControl>
                  <Input type="number" min="1" max="10" {...field} 
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
        </div>
        <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
          {isLoading ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating Quiz...</>
          ) : (
            <><Sparkles className="mr-2 h-5 w-5" /> Generate Quiz</>
          )}
        </Button>
      </form>
    </Form>
  );

  const getResultClass = (option: string, question: QuizQuestion, questionIndex: number) => {
    if (!isSubmitted) return '';
    const isCorrect = option === question.answer;
    const isSelected = studentAnswers[questionIndex] === option;

    if (isCorrect) return 'text-green-700 font-semibold';
    if (isSelected && !isCorrect) return 'text-red-700 font-semibold line-through';
    return '';
  };

  const getResultIcon = (question: QuizQuestion, questionIndex: number) => {
    if (!isSubmitted) return null;
    const isCorrect = studentAnswers[questionIndex] === question.answer;
    return isCorrect 
      ? <CheckCircle className="h-5 w-5 text-green-600" /> 
      : <XCircle className="h-5 w-5 text-red-600" />;
  };

  const resultComponent = quizData && quizData.quiz && (
    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4">
      {quizData.quiz.map((q: QuizQuestion, index: number) => (
        <Card key={index} className="bg-primary/5">
          <CardHeader>
             <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-md font-semibold">Question {index + 1}:</CardTitle>
                <CardDescription className="mt-1">{q.question}</CardDescription>
              </div>
              {getResultIcon(q, index)}
            </div>
          </CardHeader>
          <CardContent>
             <RadioGroup
                value={studentAnswers[index] || ''}
                onValueChange={(value) => handleAnswerChange(index, value)}
                disabled={isSubmitted}
              >
              {q.options.map((opt, optIndex) => (
                <div key={optIndex} className="flex items-center space-x-2">
                   <RadioGroupItem value={opt} id={`q${index}-opt${optIndex}`} />
                   <Label htmlFor={`q${index}-opt${optIndex}`} className={cn("text-sm", getResultClass(opt, q, index))}>
                      {opt}
                   </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}
      {!isSubmitted && quizData.quiz.length > 0 && (
         <Button onClick={handleSubmitQuiz} className="w-full mt-4">Submit Quiz</Button>
      )}
       {isSubmitted && (
          <Card className="mt-4 text-center p-4 bg-muted/50">
              <CardTitle>Quiz Complete!</CardTitle>
              <CardDescription>
                  You scored {quizData.quiz.filter((q, i) => q.answer === studentAnswers[i]).length} out of {quizData.quiz.length}
              </CardDescription>
          </Card>
      )}
    </div>
  );
  
  return (
    <GenAiFeaturePage
      title="Practice Quiz Generator"
      description="Test your knowledge on any topic by generating custom quizzes."
      icon={ClipboardCheck}
      formComponent={formComponent}
      resultComponent={resultComponent}
      isLoading={isLoading}
    />
  );
}
