
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { findOpportunities } from '@/ai/flows/scholarship-finder-flow';
import { ScholarshipFinderInputSchema, type ScholarshipFinderInput, type ScholarshipFinderOutput } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from '@/hooks/use-toast';
import { Search, Sparkles, Loader2, BookOpen, Briefcase, ExternalLink, Building, DollarSign } from 'lucide-react';
import { GenAiFeaturePage } from '@/components/shared/FeaturePage';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TypeIcon = ({ type }: { type: string }) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('scholarship')) return <DollarSign className="h-5 w-5 text-primary" />;
    if (lowerType.includes('internship')) return <Briefcase className="h-5 w-5 text-primary" />;
    return <BookOpen className="h-5 w-5 text-primary" />;
};

export function ScholarshipFinderClient() {
  const [result, setResult] = useState<ScholarshipFinderOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ScholarshipFinderInput>({
    resolver: zodResolver(ScholarshipFinderInputSchema),
    defaultValues: {
      fieldOfStudy: '',
      interests: '',
      opportunityType: 'scholarship',
      location: '',
    },
  });

  const onSubmit: SubmitHandler<ScholarshipFinderInput> = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await findOpportunities(data);
      setResult(response);
    } catch (error) {
      console.error("Scholarship finder error:", error);
      toast({
        title: "Error",
        description: "Failed to find opportunities. The AI may be busy or the request could not be processed. Please try again.",
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
          name="fieldOfStudy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Field of Study</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., 'Computer Science', 'Marine Biology'"
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
              <FormLabel>Your Interests & Skills</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., 'Passionate about renewable energy and have experience with Python and data analysis.'"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
               <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="opportunityType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>What are you looking for?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="scholarship" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Scholarships
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="internship" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Internships
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Location (Optional for internships)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., 'Remote', 'San Francisco, CA'"
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
              Finding opportunities...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Find Opportunities
            </>
          )}
        </Button>
      </form>
    </Form>
  );

  const resultComponent = result && result.opportunities && (
    <div className="grid md:grid-cols-2 gap-6">
      {result.opportunities.map((op, index) => (
        <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow rounded-xl flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="font-headline text-xl mb-1">{op.title}</CardTitle>
                <TypeIcon type={op.type} />
              </div>
              <div className="flex items-center gap-2">
                 <Building className="h-4 w-4 text-muted-foreground" />
                 <span className="text-sm text-muted-foreground">{op.organization}</span>
              </div>
              <Badge variant="outline" className="w-fit">{op.type}</Badge>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription className="line-clamp-4">{op.description}</CardDescription>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button asChild variant="default" className="w-full">
                <a href={op.url} target="_blank" rel="noopener noreferrer">
                  Learn More <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
      ))}
    </div>
  );

  return (
    <GenAiFeaturePage
      title="Scholarship & Internship Finder"
      description="Discover scholarships and internships from across the internet, tailored to your profile."
      icon={Search}
      formComponent={formComponent}
      resultComponent={resultComponent}
      isLoading={isLoading}
    />
  );
}
