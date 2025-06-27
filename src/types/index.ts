import { z } from 'zod';

export type UserRole = 'student' | 'teacher' | null;

export interface NavItem {
  href: string;
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

// For Collaborative Projects
export interface Project {
  id: string;
  title: string;
  description: string;
  members: string[]; // User IDs or names
  status: 'Active' | 'Completed' | 'Planning';
  lastUpdated: string;
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
