import { z } from 'zod';

export type UserRole = 'student' | 'teacher' | null;

export interface NavItem {
  href?: string;
  label: string;
  icon: React.ElementType;
  disabled?: boolean;
  external?: boolean;
  children?: NavItem[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface QuizData {
  quiz: QuizQuestion[];
}

// For Recommendations
export const GenerateRecommendationsInputSchema = z.object({
  learningGoals: z
    .string()
    .min(1, { message: "Please describe your learning goals." })
    .describe('The specific topics, skills, or subjects the user wants to learn about.'),
  currentKnowledge: z
    .string()
    .optional()
    .describe('A brief summary of what the user already knows about the topic to identify knowledge gaps.'),
  recommendationType: z
    .enum(['web_resources', 'education_programs'])
    .describe('The type of recommendation to generate: internet-wide resources or formal education programs.'),
});
export type GenerateRecommendationsInput = z.infer<typeof GenerateRecommendationsInputSchema>;

export const GenerateRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      title: z.string().describe('The title of the recommended resource or program.'),
      type: z
        .string()
        .describe(
          'The type of resource (e.g., Article, Video, Interactive Tutorial, Online Course, University Program, Online Bootcamp).'
        ),
      url: z.string().url().describe('A valid, real, and accessible URL for the resource.'),
      description: z.string().describe('A brief summary of what the resource covers and why it is being recommended.'),
    })
  ).describe('A list of 3-5 personalized recommendations.'),
});
export type GenerateRecommendationsOutput = z.infer<typeof GenerateRecommendationsOutputSchema>;


// For Resume Builder
export const ResumeBuilderInputSchema = z.object({
  fullName: z.string().min(1, 'Full name is required.'),
  contactInfo: z
    .string()
    .min(1, 'Contact information is required.')
    .describe('User email, phone number, and LinkedIn profile URL.'),
  workExperience: z
    .string()
    .min(1, 'Work experience is required.')
    .describe('Details about past jobs, roles, responsibilities, and accomplishments.'),
  education: z
    .string()
    .min(1, 'Education details are required.')
    .describe('Information about degrees, schools, and graduation dates.'),
  skills: z
    .string()
    .min(1, 'Skills are required.')
    .describe('A list of relevant hard and soft skills.'),
  jobDescription: z
    .string()
    .min(1, 'Target job description is required.')
    .describe('The full job description for the role the user is applying for.'),
});
export type ResumeBuilderInput = z.infer<typeof ResumeBuilderInputSchema>;

export const ResumeBuilderOutputSchema = z.object({
  resumeContent: z
    .string()
    .describe('The fully generated resume content in Markdown format.'),
  coverLetterContent: z
    .string()
    .describe('The fully generated cover letter content in Markdown format.'),
});
export type ResumeBuilderOutput = z.infer<typeof ResumeBuilderOutputSchema>;
