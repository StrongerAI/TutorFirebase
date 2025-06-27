"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { buildResumeAndCoverLetter } from '@/ai/flows/resume-builder-flow';
import { ResumeBuilderInputSchema, type ResumeBuilderInput, type ResumeBuilderOutput } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { FileSignature, Sparkles, Loader2, User, Briefcase, GraduationCap, Star, FileText } from 'lucide-react';
import { GenAiFeaturePage } from '@/components/shared/FeaturePage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function ResumeBuilderClient() {
  const [result, setResult] = useState<ResumeBuilderOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ResumeBuilderInput>({
    resolver: zodResolver(ResumeBuilderInputSchema),
    defaultValues: {
      fullName: '',
      contactInfo: '',
      workExperience: '',
      education: '',
      skills: '',
      jobDescription: '',
    },
  });

  const onSubmit: SubmitHandler<ResumeBuilderInput> = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await buildResumeAndCoverLetter(data);
      setResult(response);
    } catch (error) {
      console.error("Resume builder error:", error);
      toast({
        title: "Error",
        description: "Failed to build resume and cover letter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formComponent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg flex items-center gap-2"><User className="w-5 h-5 text-primary"/>Full Name</FormLabel>
                <FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg flex items-center gap-2"><User className="w-5 h-5 text-primary"/>Contact Info</FormLabel>
                <FormControl><Input placeholder="Email, Phone, LinkedIn URL" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="workExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg flex items-center gap-2"><Briefcase className="w-5 h-5 text-primary"/>Work Experience</FormLabel>
              <FormControl><Textarea placeholder="Describe your past roles, responsibilities, and achievements. Use a new line for each position." className="min-h-[120px]" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="education"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg flex items-center gap-2"><GraduationCap className="w-5 h-5 text-primary"/>Education</FormLabel>
              <FormControl><Textarea placeholder="List your degrees, institutions, and graduation dates." className="min-h-[80px]" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg flex items-center gap-2"><Star className="w-5 h-5 text-primary"/>Skills</FormLabel>
              <FormControl><Textarea placeholder="List your key skills, separated by commas (e.g., JavaScript, React, Project Management)." className="min-h-[80px]" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jobDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg flex items-center gap-2"><FileText className="w-5 h-5 text-primary"/>Target Job Description</FormLabel>
              <FormControl><Textarea placeholder="Paste the full job description here to tailor your documents." className="min-h-[120px]" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
          {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Building Your Documents...</> : <><Sparkles className="mr-2 h-5 w-5" />Build Resume & Cover Letter</>}
        </Button>
      </form>
    </Form>
  );

  const resultComponent = result && (
    <Tabs defaultValue="resume" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="resume">Resume</TabsTrigger>
        <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
      </TabsList>
      <TabsContent value="resume">
        <Card className="mt-2">
          <CardHeader>
            <CardTitle>Generated Resume</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none p-6 pt-0">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {result.resumeContent}
            </ReactMarkdown>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="cover-letter">
        <Card className="mt-2">
           <CardHeader>
            <CardTitle>Generated Cover Letter</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none p-6 pt-0">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {result.coverLetterContent}
            </ReactMarkdown>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );

  return (
    <GenAiFeaturePage
      title="AI Resume Builder"
      description="Create a professional resume and tailored cover letter in minutes."
      icon={FileSignature}
      formComponent={formComponent}
      resultComponent={resultComponent}
      isLoading={isLoading}
    />
  );
}
