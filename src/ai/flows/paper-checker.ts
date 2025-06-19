'use server';

/**
 * @fileOverview An AI paper checker for teachers.
 *
 * - analyzeAndGradePaper - A function that handles the paper analysis and grading process.
 * - AnalyzeAndGradePaperInput - The input type for the analyzeAndGradePaper function.
 * - AnalyzeAndGradePaperOutput - The return type for the analyzeAndGradePaper function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAndGradePaperInputSchema = z.object({
  paperText: z.string().describe('The text content of the student paper.'),
  assignmentInstructions: z.string().describe('The instructions provided to the students for the assignment.'),
  gradingRubric: z.string().describe('The rubric to be used for grading the paper.'),
  additionalContext: z.string().optional().describe('Additional context or information that might be helpful in grading the paper.'),
});
export type AnalyzeAndGradePaperInput = z.infer<typeof AnalyzeAndGradePaperInputSchema>;

const AnalyzeAndGradePaperOutputSchema = z.object({
  grade: z.string().describe('The grade assigned to the paper.'),
  feedback: z.string().describe('Detailed feedback on the paper, including strengths and areas for improvement.'),
  scoreBreakdown: z.string().optional().describe('A breakdown of the score based on the grading rubric, if applicable.'),
  suggestions: z.string().optional().describe('Suggestions for the student to improve their writing or understanding of the material.'),
});
export type AnalyzeAndGradePaperOutput = z.infer<typeof AnalyzeAndGradePaperOutputSchema>;

export async function analyzeAndGradePaper(input: AnalyzeAndGradePaperInput): Promise<AnalyzeAndGradePaperOutput> {
  return analyzeAndGradePaperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeAndGradePaperPrompt',
  input: {schema: AnalyzeAndGradePaperInputSchema},
  output: {schema: AnalyzeAndGradePaperOutputSchema},
  prompt: `You are an AI paper checker designed to assist teachers in grading student papers. Your task is to analyze the paper based on the provided assignment instructions, grading rubric, and any additional context. Provide a grade, detailed feedback, a score breakdown (if applicable), and suggestions for improvement.

Assignment Instructions: {{{assignmentInstructions}}}
Grading Rubric: {{{gradingRubric}}}
Additional Context: {{{additionalContext}}}

Paper Text:
{{{paperText}}}`,
});

const analyzeAndGradePaperFlow = ai.defineFlow(
  {
    name: 'analyzeAndGradePaperFlow',
    inputSchema: AnalyzeAndGradePaperInputSchema,
    outputSchema: AnalyzeAndGradePaperOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
