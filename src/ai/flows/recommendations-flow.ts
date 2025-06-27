'use server';
/**
 * @fileOverview An AI-powered recommendation engine for learning resources.
 *
 * - generateRecommendations - A function that provides personalized learning recommendations.
 */

import {ai} from '@/ai/genkit';
import { GenerateRecommendationsInputSchema, GenerateRecommendationsOutputSchema, type GenerateRecommendationsInput, type GenerateRecommendationsOutput } from '@/types';


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
