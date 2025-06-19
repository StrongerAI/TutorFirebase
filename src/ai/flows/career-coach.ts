
// src/ai/flows/career-coach.ts
'use server';
/**
 * @fileOverview Provides comprehensive career path suggestions and identifies skills for development.
 *
 * - careerCoach - A function that provides career coaching based on detailed user input.
 * - CareerCoachInput - The input type for the careerCoach function.
 * - CareerCoachOutput - The return type for the careerCoach function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CareerCoachInputSchema = z.object({
  currentSkills: z
    .string()
    .describe('A detailed list or description of the user\'s current skills and expertise.'),
  interests: z
    .string()
    .describe('A description of the user\'s passions, hobbies, and areas of interest.'),
  workExperience: z
    .string()
    .optional()
    .describe('A summary of the user\'s past work experience, if any.'),
  careerAspirations: z
    .string()
    .describe('What the user hopes to achieve in their career, their long-term goals.'),
  preferredWorkEnvironment: z
    .string()
    .optional()
    .describe('The user\'s preferred type of work environment (e.g., fast-paced startup, stable corporate, remote, collaborative team, independent).'),
});
export type CareerCoachInput = z.infer<typeof CareerCoachInputSchema>;

const CareerCoachOutputSchema = z.object({
  suggestedCareerPaths: z
    .string()
    .describe('A list of 3-5 suggested career paths tailored to the user\'s profile.'),
  skillsToDevelop: z
    .string()
    .describe('A list of key skills the user should focus on developing for these paths.'),
  actionableSteps: z
    .string()
    .describe('Concrete next steps the user can take to start moving towards these career paths.'),
});
export type CareerCoachOutput = z.infer<typeof CareerCoachOutputSchema>;

export async function careerCoach(input: CareerCoachInput): Promise<CareerCoachOutput> {
  return careerCoachFlow(input);
}

const prompt = ai.definePrompt({
  name: 'careerCoachPrompt',
  input: {schema: CareerCoachInputSchema},
  output: {schema: CareerCoachOutputSchema},
  prompt: `You are an expert AI career coach. Your goal is to provide personalized and actionable career advice.

Analyze the user's comprehensive profile:
Current Skills: {{{currentSkills}}}
Interests: {{{interests}}}
Work Experience (if any): {{{workExperience}}}
Career Aspirations: {{{careerAspirations}}}
Preferred Work Environment (if any): {{{preferredWorkEnvironment}}}

Based on this information:
1. Suggest 3-5 specific career paths that align well with their profile.
2. Identify key skills they should prioritize developing to succeed in these paths.
3. Provide concrete, actionable next steps they can take (e.g., specific online courses, types of projects to undertake, networking advice).

Output the suggested career paths, skills to develop, and actionable steps as clear, distinct sections or lists.
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
