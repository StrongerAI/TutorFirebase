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

// Use a structured schema for the output instead of a string
const QuestionSchema = z.object({
    question: z.string().describe("The question text."),
    options: z.array(z.string()).describe("An array of possible answers."),
    answer: z.string().describe("The correct answer, which must be one of the options."),
});

const GenerateQuizOutputSchema = z.object({
  quiz: z.array(QuestionSchema).describe("An array of question objects that form the quiz."),
});

// The output type is now the structured QuizData
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;


export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema}, // Use the new structured schema
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
    outputSchema: GenerateQuizOutputSchema, // Use the new structured schema
  },
  async input => {
    const {output} = await prompt(input);
    // The output is now already parsed by Genkit into the correct object structure
    return output!;
  }
);
