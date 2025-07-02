
'use server';
/**
 * @fileOverview A general-purpose conversational AI flow.
 *
 * - generateResponse - A function that generates a text response to a given prompt.
 * - GenerateResponseInput - The input type for the generateResponse function.
 * - GenerateResponseOutput - The return type for the generateResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResponseInputSchema = z.object({
  prompt: z.string().describe("The user's message or question."),
});
export type GenerateResponseInput = z.infer<typeof GenerateResponseInputSchema>;

const GenerateResponseOutputSchema = z.object({
  response: z.string().describe('The AI-generated response.'),
});
export type GenerateResponseOutput = z.infer<typeof GenerateResponseOutputSchema>;

export async function generateResponse(input: GenerateResponseInput): Promise<GenerateResponseOutput> {
  return generateResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateResponsePrompt',
  input: {schema: GenerateResponseInputSchema},
  output: {schema: GenerateResponseOutputSchema},
  prompt: `You are a helpful AI assistant for the TutorTrack platform. Respond to the user's prompt.

User Prompt:
{{{prompt}}}

AI Response:`,
});

const generateResponseFlow = ai.defineFlow(
  {
    name: 'generateResponseFlow',
    inputSchema: GenerateResponseInputSchema,
    outputSchema: GenerateResponseOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
