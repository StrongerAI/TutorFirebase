// QuizMaker flow implementation

'use server';
/**
 * @fileOverview AI-powered quiz generation tool for teachers.
 *
 * - generateQuiz - A function that generates a quiz based on the given topic, number of questions, and difficulty level.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizInputSchema = z.object({
  topic: z.string().describe('The topic of the quiz.'),
  numQuestions: z.number().int().min(1).max(20).describe('The number of questions in the quiz (1-20).'),
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .describe('The difficulty level of the quiz.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  quiz: z.string().describe('The generated quiz in JSON format.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `You are a quiz generator for teachers. Generate a quiz on the topic of {{{topic}}} with {{{numQuestions}}} questions and a difficulty level of {{{difficulty}}}.

The output must be a single JSON object with a key named "quiz". This key should contain an array of question objects. Each question object must have the following keys: "question", "options" (an array of strings), and "answer" (a string that is one of the options).

Example Quiz Format:
{
  "quiz": [
    {
      "question": "What is the capital of France?",
      "options": ["Berlin", "Paris", "Madrid", "Rome"],
      "answer": "Paris"
    },
    {
      "question": "What is the value of PI?",
      "options": ["3.14", "3.12", "2.12", "1.01"],
      "answer": "3.14"
    }
  ]
}

Ensure the entire output is a single, valid JSON object and nothing else.
`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
