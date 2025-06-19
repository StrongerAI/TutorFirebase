// src/ai/flows/career-coach.ts
'use server';
/**
 * @fileOverview Provides career path suggestions and identifies skills for development.
 *
 * - careerCoach - A function that provides career coaching based on user skills and interests.
 * - CareerCoachInput - The input type for the careerCoach function.
 * - CareerCoachOutput - The return type for the careerCoach function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CareerCoachInputSchema = z.object({
  skillsAndInterests: z
    .string()
    .describe('A description of the user\'s skills and interests.'),
});
export type CareerCoachInput = z.infer<typeof CareerCoachInputSchema>;

const CareerCoachOutputSchema = z.object({
  suggestedCareerPaths: z
    .string()
    .describe('A list of suggested career paths based on the input.'),
  skillsToDevelop: z
    .string()
    .describe('A list of skills the user should develop to pursue these paths.'),
});
export type CareerCoachOutput = z.infer<typeof CareerCoachOutputSchema>;

export async function careerCoach(input: CareerCoachInput): Promise<CareerCoachOutput> {
  return careerCoachFlow(input);
}

const prompt = ai.definePrompt({
  name: 'careerCoachPrompt',
  input: {schema: CareerCoachInputSchema},
  output: {schema: CareerCoachOutputSchema},
  prompt: `You are a career coach who provides personalized career path suggestions and identifies skills for development based on the user's skills and interests.

Analyze the user's skills and interests, and suggest 3-5 potential career paths that align with them. Also, identify key skills the user should develop to succeed in those career paths.

Skills and Interests: {{{skillsAndInterests}}}

Output the suggested career paths and skills to develop as lists.
`,
});

const careerCoachFlow = ai.defineFlow(
  {
    name: 'careerCoachFlow',
    inputSchema: CareerCoachInputSchema,
    outputSchema: CareerCoachOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
