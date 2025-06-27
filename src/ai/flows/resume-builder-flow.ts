'use server';
/**
 * @fileOverview An AI-powered resume and cover letter builder.
 *
 * - buildResumeAndCoverLetter - A function that generates resume and cover letter content.
 */

import {ai} from '@/ai/genkit';
import { ResumeBuilderInputSchema, ResumeBuilderOutputSchema, type ResumeBuilderInput, type ResumeBuilderOutput } from '@/types';

export async function buildResumeAndCoverLetter(input: ResumeBuilderInput): Promise<ResumeBuilderOutput> {
  return resumeBuilderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'resumeBuilderPrompt',
  input: {schema: ResumeBuilderInputSchema},
  output: {schema: ResumeBuilderOutputSchema},
  prompt: `You are an expert career coach and professional resume writer. Your task is to generate a professional resume and a tailored cover letter based on the user's information and the provided job description.

**User Information:**
- Full Name: {{{fullName}}}
- Contact Info: {{{contactInfo}}}
- Work Experience: {{{workExperience}}}
- Education: {{{education}}}
- Skills: {{{skills}}}

**Target Job Description:**
{{{jobDescription}}}

**Instructions:**
1.  **Resume:** Create a clean, professional resume in Markdown format. Start with the user's name and contact information. Follow with a professional summary, skills, work experience, and education sections. Tailor the language to highlight the most relevant aspects of the user's profile for the target job. Use bullet points for accomplishments in the work experience section.
2.  **Cover Letter:** Write a compelling and professional cover letter. It should be addressed generically (e.g., "Dear Hiring Manager,"). The letter must:
    - Express enthusiasm for the role described in the job description.
    - Briefly introduce the user.
    - Highlight 2-3 key skills or experiences that directly match the job requirements.
    - End with a strong call to action, expressing eagerness for an interview.
    - Ensure the tone is professional and confident.

Output the resume and cover letter content in their respective fields.`,
});

const resumeBuilderFlow = ai.defineFlow(
  {
    name: 'resumeBuilderFlow',
    inputSchema: ResumeBuilderInputSchema,
    outputSchema: ResumeBuilderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
