'use server';
/**
 * @fileOverview An AI-powered recommendation engine for learning resources.
 *
 * - generateRecommendations - A function that provides personalized learning recommendations.
 * - GenerateRecommendationsInput - The input type for the generateRecommendations function.
 * - GenerateRecommendationsOutput - The return type for the generateRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateRecommendationsInputSchema = z.object({
  learningGoals: z
    .string()
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

export async function generateRecommendations(
  input: GenerateRecommendationsInput
): Promise<GenerateRecommendationsOutput> {
  return recommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendationsPrompt',
  input: {schema: GenerateRecommendationsInputSchema},
  output: {schema: GenerateRecommendationsOutputSchema},
  prompt: `You are an expert AI learning advisor. Your task is to generate a list of personalized learning recommendations based on the user's goals and current knowledge.

Analyze the user's input to understand their learning objectives and identify potential knowledge gaps.

User's Learning Goals: {{{learningGoals}}}
User's Current Knowledge: {{{currentKnowledge}}}
Type of Recommendation Requested: {{{recommendationType}}}

Instructions:
1. Generate between 3 and 5 high-quality recommendations.
2. For each recommendation, provide a title, type, a brief description, and a REAL, VERIFIABLE URL. Do not make up URLs.
3. If the user requests 'web_resources', find a mix of high-quality articles, interactive tutorials, videos, or free/paid online courses from reputable sources (e.g., official documentation, established educational platforms like Coursera/edX, respected blogs, YouTube channels).
4. If the user requests 'education_programs', find relevant university degrees (undergraduate or graduate), online bootcamps, or professional certificate programs from accredited institutions or well-known providers.
5. Tailor the description to explain why each resource is a good fit for the user's specific goals.
`,
});

const recommendationsFlow = ai.defineFlow(
  {
    name: 'recommendationsFlow',
    inputSchema: GenerateRecommendationsInputSchema,
    outputSchema: GenerateRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
