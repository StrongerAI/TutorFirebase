
'use server';
/**
 * @fileOverview An AI-powered skills guide to help users plan their skill development.
 *
 * - generateSkillsGuide - A function that provides a personalized skills development plan.
 * - SkillsGuideInput - The input type for the generateSkillsGuide function.
 * - SkillsGuideOutput - The return type for the generateSkillsGuide function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillsGuideInputSchema = z.object({
  currentSkills: z
    .string()
    .describe('A detailed list or description of the user\'s current skills and proficiency levels.'),
  desiredSkills: z
    .string()
    .describe('A list or description of the skills the user wants to learn or improve.'),
  careerGoal: z
    .string()
    .optional()
    .describe('The user\'s primary career goal or aspiration that these skills will support.'),
  learningStylePreference: z
    .string()
    .optional()
    .describe('User\'s preferred learning style (e.g., visual, auditory, kinesthetic, reading/writing, project-based, structured courses).'),
  timeCommitment: z
    .string()
    .optional()
    .describe('How much time per week the user can commit to learning (e.g., 2-4 hours, 5-10 hours).')
});
export type SkillsGuideInput = z.infer<typeof SkillsGuideInputSchema>;

const SkillsGuideOutputSchema = z.object({
  skillsAnalysis: z
    .string()
    .describe('A brief analysis of the gap between current and desired skills, considering the career goal.'),
  learningPathSuggestions: z
    .string()
    .describe('A suggested learning path or strategy, broken down into manageable steps or modules.'),
  recommendedResources: z
    .string()
    .describe('A list of specific, actionable resources (e.g., online courses, books, project ideas, communities) tailored to the desired skills and learning style.'),
  milestonesAndTimeline: z
    .string()
    .optional()
    .describe('Suggested milestones and a loose timeline, considering the time commitment if provided.'),
});
export type SkillsGuideOutput = z.infer<typeof SkillsGuideOutputSchema>;

export async function generateSkillsGuide(input: SkillsGuideInput): Promise<SkillsGuideOutput> {
  return skillsGuideFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skillsGuidePrompt',
  input: {schema: SkillsGuideInputSchema},
  output: {schema: SkillsGuideOutputSchema},
  prompt: `You are an AI Skills Development Coach. Your task is to create a personalized skills guide based on the user's input.

User Profile:
Current Skills & Proficiency: {{{currentSkills}}}
Desired Skills to Learn/Improve: {{{desiredSkills}}}
Career Goal (if provided): {{{careerGoal}}}
Preferred Learning Style (if provided): {{{learningStylePreference}}}
Weekly Time Commitment (if provided): {{{timeCommitment}}}

Based on this information, please provide:
1.  **Skills Analysis:** A brief analysis of the gap between their current and desired skills, especially in relation to their career goal (if stated).
2.  **Learning Path Suggestions:** A structured learning path. Break this down into logical steps, modules, or focus areas.
3.  **Recommended Resources:** Specific and actionable learning resources. Suggest a mix like online courses (mention platforms like Coursera, Udemy, edX if relevant), books, hands-on projects, communities to join, or influential blogs/people to follow. Tailor these to the desired skills and, if possible, the user's learning style.
4.  **Milestones & Timeline (Optional):** If a time commitment is mentioned, suggest some achievable milestones and a general timeline. Keep it flexible.

Present the information clearly, using headings or bullet points for readability. Be encouraging and practical.
`,
});

const skillsGuideFlow = ai.defineFlow(
  {
    name: 'skillsGuideFlow',
    inputSchema: SkillsGuideInputSchema,
    outputSchema: SkillsGuideOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
