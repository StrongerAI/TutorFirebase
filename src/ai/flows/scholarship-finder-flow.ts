'use server';
/**
 * @fileOverview An AI-powered tool to find scholarships and internships.
 *
 * - findOpportunities - A function that provides personalized opportunity recommendations.
 */

import {ai} from '@/ai/genkit';
import { ScholarshipFinderInputSchema, ScholarshipFinderOutputSchema, type ScholarshipFinderInput, type ScholarshipFinderOutput } from '@/types';


export async function findOpportunities(
  input: ScholarshipFinderInput
): Promise<ScholarshipFinderOutput> {
  return scholarshipFinderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scholarshipFinderPrompt',
  input: {schema: ScholarshipFinderInputSchema},
  output: {schema: ScholarshipFinderOutputSchema},
  prompt: `You are an expert career and academic advisor AI. Your task is to find relevant scholarships or internships based on the user's profile.

Analyze the user's input carefully.

User's Field of Study: {{{fieldOfStudy}}}
User's Interests: {{{interests}}}
Type of Opportunity Requested: {{{opportunityType}}}
Preferred Location: {{{location}}}

Instructions:
1. Generate between 3 and 5 high-quality recommendations for the requested opportunity type.
2. For each recommendation, provide a title, the offering organization, the type (Scholarship or Internship), a brief description, and a REAL, VERIFIABLE URL. Do not make up URLs. Search the web for current opportunities.
3. Tailor the description to explain why each opportunity is a good fit for the user's specific profile.
4. If location is provided for an internship search, prioritize opportunities in or compatible with that location (including remote).
`,
});

const scholarshipFinderFlow = ai.defineFlow(
  {
    name: 'scholarshipFinderFlow',
    inputSchema: ScholarshipFinderInputSchema,
    outputSchema: ScholarshipFinderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
