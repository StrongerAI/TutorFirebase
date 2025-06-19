// src/ai/flows/assignment-help.ts
'use server';
/**
 * @fileOverview An AI-powered assignment assistant for students.
 *
 * - assignmentHelp - A function that provides explanations, suggestions, and guidance for student assignments.
 * - AssignmentHelpInput - The input type for the assignmentHelp function.
 * - AssignmentHelpOutput - The return type for the assignmentHelp function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssignmentHelpInputSchema = z.object({
  assignmentDetails: z
    .string()
    .describe('Detailed information about the assignment, including instructions, context, and specific problems.'),
  studentLevel: z
    .string()
    .describe('The student level (e.g., high school, undergraduate, graduate).'),
  specificQuestion: z.string().optional().describe('A specific question the student has about the assignment.'),
});
export type AssignmentHelpInput = z.infer<typeof AssignmentHelpInputSchema>;

const AssignmentHelpOutputSchema = z.object({
  explanation: z.string().describe('An explanation of the relevant concepts or problems.'),
  suggestions: z.string().describe('Suggestions and guidance for completing the assignment.'),
  hint: z.string().optional().describe('A helpful hint to guide the student if they are stuck.'),
});
export type AssignmentHelpOutput = z.infer<typeof AssignmentHelpOutputSchema>;

export async function assignmentHelp(input: AssignmentHelpInput): Promise<AssignmentHelpOutput> {
  return assignmentHelpFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assignmentHelpPrompt',
  input: {schema: AssignmentHelpInputSchema},
  output: {schema: AssignmentHelpOutputSchema},
  prompt: `You are an AI-powered assignment assistant designed to help students with their assignments.

You will analyze the assignment details and the student's level to provide helpful explanations, suggestions, and guidance.
If the student has a specific question, you will address it directly.

Consider offering hints if the student seems stuck, but don't give away the answer directly.

Assignment Details: {{{assignmentDetails}}}
Student Level: {{{studentLevel}}}
Specific Question: {{{specificQuestion}}}

Explanation: An explanation of the relevant concepts or problems.
Suggestions: Suggestions and guidance for completing the assignment.
Hint: A helpful hint to guide the student if they are stuck.
`,
});

const assignmentHelpFlow = ai.defineFlow(
  {
    name: 'assignmentHelpFlow',
    inputSchema: AssignmentHelpInputSchema,
    outputSchema: AssignmentHelpOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
