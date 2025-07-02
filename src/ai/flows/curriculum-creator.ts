// src/ai/flows/curriculum-creator.ts
'use server';

/**
 * @fileOverview Curriculum Creator AI agent.
 *
 * - createCurriculum - A function that creates a curriculum outline based on subject matter and learning objectives.
 * - CreateCurriculumInput - The input type for the createCurriculum function.
 * - CreateCurriculumOutput - The return type for the createCurriculum function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateCurriculumInputSchema = z.object({
  subject: z.string().describe('The subject matter for the curriculum.'),
  learningObjectives: z.string().describe('The learning objectives for the curriculum.'),
});

export type CreateCurriculumInput = z.infer<typeof CreateCurriculumInputSchema>;

const CurriculumModuleSchema = z.object({
    moduleNumber: z.number().describe("The sequential number of the module."),
    moduleTitle: z.string().describe("The title of the module."),
    topics: z.array(z.string()).describe("A list of specific topics covered in this module."),
    activities: z.array(z.string()).describe("A list of suggested learning activities for this module.")
});

const CreateCurriculumOutputSchema = z.object({
  title: z.string().describe("The overall title of the curriculum."),
  description: z.string().describe("A brief description of the curriculum."),
  learning_objectives: z.array(z.string()).describe("A list of key learning objectives for the entire curriculum."),
  modules: z.array(CurriculumModuleSchema).describe("An array of curriculum modules.")
});

export type CreateCurriculumOutput = z.infer<typeof CreateCurriculumOutputSchema>;

export async function createCurriculum(input: CreateCurriculumInput): Promise<CreateCurriculumOutput> {
  return createCurriculumFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createCurriculumPrompt',
  input: {schema: CreateCurriculumInputSchema},
  output: {schema: CreateCurriculumOutputSchema},
  prompt: `You are an expert curriculum designer. Your task is to create a structured and detailed curriculum outline in JSON format based on the provided subject and learning objectives.

Subject: {{{subject}}}
Primary Learning Objectives: {{{learningObjectives}}}

Please generate a comprehensive curriculum that includes:
1.  A main title for the curriculum.
2.  A brief, engaging description of what the curriculum covers.
3.  A list of 3-5 high-level learning objectives for the entire curriculum.
4.  A series of modules (between 3 and 5), where each module contains:
    - A module number.
    - A clear module title.
    - A list of specific topics to be covered.
    - A list of suggested activities or assignments for that module.

Ensure the entire output is a single, valid JSON object that strictly follows the provided output schema. Do not include any text or formatting outside of the JSON object.
`,
});

const createCurriculumFlow = ai.defineFlow(
  {
    name: 'createCurriculumFlow',
    inputSchema: CreateCurriculumInputSchema,
    outputSchema: CreateCurriculumOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
