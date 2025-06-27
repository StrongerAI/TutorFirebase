"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateRecommendations } from '@/ai/flows/recommendations-flow';
import { GenerateRecommendationsInputSchema, type GenerateRecommendationsInput, type GenerateRecommendationsOutput } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from '@/hooks/use-toast';
import { Lightbulb, BookOpen, Film, Newspaper, ExternalLink, GraduationCap, Sparkles, Loader2, Laptop } from 'lucide-react';
import { GenAiFeaturePage } from '@/components/shared/FeaturePage';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';


const TypeIcon = ({ type }: { type: string }) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('course')) return <BookOpen className="h-5 w-5 text-primary" />;
    if (lowerType.includes('bootcamp')) return <Laptop className="h-5 w-5 text-primary" />;
    if (lowerType.includes('program') || lowerType.includes('degree')) return <GraduationCap className="h-5 w-5 text-primary" />;
    if (lowerType.includes('video')) return <Film className="h-5 w-5 text-primary" />;
    if (lowerType.includes('article') || lowerType.includes('blog')) return <Newspaper className="h-5 w-5 text-primary" />;
    return <BookOpen className="h-5 w-5 text-primary" />;
};


export function RecommendationsClient() {
  const [result, setResult] = useState<GenerateRecommendationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<GenerateRecommendationsInput>({
    resolver: zodResolver(GenerateRecommendationsInputSchema),
    defaultValues: {
      learningGoals: '',
      currentKnowledge: '',
      recommendationType: 'web_resources',
    },
  });

  const onSubmit: SubmitHandler<GenerateRecommendationsInput> = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generateRecommendations(data);
      setResult(response);
    } catch (error) {
      console.error("Recommendations error:", error);
      toast({
        title: "Error",
        description: "Failed to generate recommendations. The AI may be busy or the request could not be processed. Please try again.",
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
          name="learningGoals"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">What do you want to learn?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., 'I want to learn about quantum computing from scratch' or 'I need to get better at data visualization for my marketing job'."
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
          name="currentKnowledge"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">What do you already know? (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., 'I have a basic understanding of Python' or 'I'm a complete beginner'."
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
          name="recommendationType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-lg">What are you looking for?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="web_resources" />
                    </FormControl>
                    <FormLabel className="font-normal text-base">
                      Online Resources (Articles, Videos, Courses)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="education_programs" />
                    </FormControl>
                    <FormLabel className="font-normal text-base">
                      Educational Programs (Degrees, Bootcamps)
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Searching for recommendations...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Find Recommendations
            </>
          )}
        </Button>
      </form>
    </Form>
  );

  const resultComponent = result && result.recommendations && (
    <div className="grid md:grid-cols-2 gap-6">
      {result.recommendations.map((rec, index) => (
        <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow rounded-xl flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="font-headline text-xl mb-1">{rec.title}</CardTitle>
                <TypeIcon type={rec.type} />
              </div>
              <Badge variant="outline" className="w-fit">{rec.type}</Badge>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription className="line-clamp-4">{rec.description}</CardDescription>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button asChild variant="default" className="w-full">
                <a href={rec.url} target="_blank" rel="noopener noreferrer">
                  View Resource <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
      ))}
    </div>
  );

  return (
    <GenAiFeaturePage
      title="Personalized Recommendations"
      description="Discover learning resources and educational programs from across the internet, tailored to your goals."
      icon={Lightbulb}
      formComponent={formComponent}
      resultComponent={resultComponent}
      isLoading={isLoading}
    />
  );
}
