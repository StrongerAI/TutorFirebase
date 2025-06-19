
'use server';
/**
 * @fileOverview An AI flow to generate a concise title for a chat conversation.
 *
 * - summarizeChatTitle - A function that generates a title based on a snippet of conversation.
 * - SummarizeChatTitleInput - The input type for the summarizeChatTitle function.
 * - SummarizeChatTitleOutput - The return type for the summarizeChatTitle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeChatTitleInputSchema = z.object({
  conversationSnippet: z
    .string()
    .describe('The first few messages of a conversation (e.g., user query and AI response).'),
});
export type SummarizeChatTitleInput = z.infer<typeof SummarizeChatTitleInputSchema>;

const SummarizeChatTitleOutputSchema = z.object({
  title: z
    .string()
    .describe('A concise title for the conversation, ideally 3-5 words long.'),
});
export type SummarizeChatTitleOutput = z.infer<typeof SummarizeChatTitleOutputSchema>;

export async function summarizeChatTitle(input: SummarizeChatTitleInput): Promise<SummarizeChatTitleOutput> {
  return summarizeChatTitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeChatTitlePrompt',
  input: {schema: SummarizeChatTitleInputSchema},
  output: {schema: SummarizeChatTitleOutputSchema},
  prompt: `You are an expert at summarizing conversations. Given the following snippet from the beginning of a chat, generate a very concise and representative title for the entire conversation. The title should be 3-5 words long.

Conversation Snippet:
{{{conversationSnippet}}}

Title:`,
});

const summarizeChatTitleFlow = ai.defineFlow(
  {
    name: 'summarizeChatTitleFlow',
    inputSchema: SummarizeChatTitleInputSchema,
    outputSchema: SummarizeChatTitleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
