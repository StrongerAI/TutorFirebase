
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateSkillsGuide, type SkillsGuideInput, type SkillsGuideOutput } from '@/ai/flows/skills-guide-flow';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Zap, Layers, Sparkles as DesiredSkillsIcon, Target, Palette, Clock, Loader2, Sparkles as AiSparkles, Activity, BookOpen, Milestone } from 'lucide-react';
import { z } from 'zod';
import { GenAiFeaturePage } from '@/components/shared/FeaturePage';

const SkillsGuideInputClientSchema = z.object({
  currentSkills: z.string().min(20, { message: "Please describe your current skills (min 20 characters)." }),
  desiredSkills: z.string().min(10, { message: "Please list skills you want to develop (min 10 characters)." }),
  careerGoal: z.string().optional(),
  learningStylePreference: z.string().optional(),
  timeCommitment: z.string().optional(),
});

const learningStyleOptions = [
    { value: "visual", label: "Visual (diagrams, videos)" },
    { value: "auditory", label: "Auditory (lectures, discussions)" },
    { value: "kinesthetic", label: "Kinesthetic (hands-on practice)" },
    { value: "reading_writing", label: "Reading/Writing (texts, note-taking)" },
    { value: "project_based", label: "Project-based learning" },
    { value: "structured_courses", label: "Structured Courses" },
    { value: "mixed", label: "Mixed/Flexible" },
];

const timeCommitmentOptions = [
    { value: "1-2_hours_week", label: "1-2 hours per week" },
    { value: "2-4_hours_week", label: "2-4 hours per week" },
    { value: "5-7_hours_week", label: "5-7 hours per week" },
    { value: "8-10_hours_week", label: "8-10 hours per week" },
    { value: "10+_hours_week", label: "10+ hours per week" },
    { value: "flexible", label: "Flexible / Varies" },
];


export function SkillsGuideClient() {
  const [result, setResult] = useState<SkillsGuideOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<SkillsGuideInput>({
    resolver: zodResolver(SkillsGuideInputClientSchema),
    defaultValues: {
      currentSkills: '',
      desiredSkills: '',
      careerGoal: '',
      learningStylePreference: undefined,
      timeCommitment: undefined,
    },
  });

  const onSubmit: SubmitHandler<SkillsGuideInput> = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generateSkillsGuide(data);
      setResult(response);
    } catch (error) {
      console.error("Skills guide error:", error);
      toast({
        title: "Error",
        description: "Failed to generate skills guide. Please try again.",
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
              <FormLabel className="flex items-center gap-2"><Layers className="w-5 h-5 text-primary" />Your Current Skills & Proficiency</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Proficient in JavaScript (React, Node.js), Intermediate Python (Pandas, Flask), Basic UI/UX design principles..."
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
          name="desiredSkills"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2"><DesiredSkillsIcon className="w-5 h-5 text-primary" />Skills You Want to Develop</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Advanced Machine Learning, Cloud Architecture (AWS), Mobile App Development (Flutter), Effective Leadership..."
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
          name="careerGoal"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2"><Target className="w-5 h-5 text-primary" />Primary Career Goal (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Become a Senior Data Scientist, Launch my own tech startup"
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
            name="learningStylePreference"
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="flex items-center gap-2"><Palette className="w-5 h-5 text-primary"/>Preferred Learning Style (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select your learning style" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {learningStyleOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
            name="timeCommitment"
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary"/>Weekly Time Commitment (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select your available time" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {timeCommitmentOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Your Guide...
            </>
          ) : (
            <>
              <AiSparkles className="mr-2 h-5 w-5" />
              Get My Skills Guide
            </>
          )}
        </Button>
      </form>
    </Form>
  );

  const formatList = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((item, index) => item.trim() && !item.startsWith("###") && <li key={index} className="mb-1 ml-4">{item.replace(/^- /, '')}</li>).filter(Boolean);
  };

  const resultComponent = result && (
    <div className="space-y-6">
      {result.skillsAnalysis && (
        <div>
          <h3 className="text-xl font-semibold mb-2 font-headline flex items-center gap-2"><Activity className="w-6 h-6 text-primary" />Skills Analysis</h3>
          <p className="text-card-foreground/90 whitespace-pre-wrap bg-primary/5 p-4 rounded-md">{result.skillsAnalysis}</p>
        </div>
      )}
      {result.learningPathSuggestions && (
        <div>
          <h3 className="text-xl font-semibold mb-2 font-headline flex items-center gap-2"><Zap className="w-6 h-6 text-primary"/>Learning Path Suggestions</h3>
          <ul className="list-disc list-outside text-card-foreground/90 bg-primary/5 p-4 rounded-md space-y-1">
            {formatList(result.learningPathSuggestions)}
          </ul>
        </div>
      )}
      {result.recommendedResources && (
        <div>
          <h3 className="text-xl font-semibold mb-2 font-headline flex items-center gap-2"><BookOpen className="w-6 h-6 text-primary"/>Recommended Resources</h3>
           <ul className="list-disc list-outside text-card-foreground/90 bg-primary/5 p-4 rounded-md space-y-1">
            {formatList(result.recommendedResources)}
          </ul>
        </div>
      )}
      {result.milestonesAndTimeline && (
        <div>
          <h3 className="text-xl font-semibold mb-2 font-headline flex items-center gap-2"><Milestone className="w-6 h-6 text-primary"/>Milestones & Timeline</h3>
          <ul className="list-disc list-outside text-card-foreground/90 bg-primary/5 p-4 rounded-md space-y-1">
            {formatList(result.milestonesAndTimeline)}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <GenAiFeaturePage
      title="AI Skills Guide"
      description="Get a personalized plan to develop new skills and achieve your career goals."
      icon={Zap}
      formComponent={formComponent}
      resultComponent={resultComponent}
      isLoading={isLoading}
    />
  );
}
