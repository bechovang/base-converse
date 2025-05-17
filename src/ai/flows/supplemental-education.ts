// src/ai/flows/supplemental-education.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing supplemental educational content
 * related to number system conversions.
 *
 * - getSupplementalContent - A function that takes a number and its source and target bases
 *   and returns educational content to supplement the user's knowledge.
 * - SupplementalContentInput - The input type for the getSupplementalContent function.
 * - SupplementalContentOutput - The return type for the getSupplementalContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SupplementalContentInputSchema = z.object({
  number: z.string().describe('The number being converted.'),
  sourceBase: z.number().describe('The base of the original number.'),
  targetBase: z.number().describe('The base to which the number is being converted.'),
});
export type SupplementalContentInput = z.infer<typeof SupplementalContentInputSchema>;

const SupplementalContentOutputSchema = z.object({
  content: z.string().describe('Educational content related to the number conversion.'),
});
export type SupplementalContentOutput = z.infer<typeof SupplementalContentOutputSchema>;

export async function getSupplementalContent(input: SupplementalContentInput): Promise<SupplementalContentOutput> {
  return supplementalContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'supplementalContentPrompt',
  input: {schema: SupplementalContentInputSchema},
  output: {schema: SupplementalContentOutputSchema},
  prompt: `Provide educational content to supplement the user's knowledge about the number conversion.

  Number: {{{number}}}
  Source Base: {{{sourceBase}}}
  Target Base: {{{targetBase}}}

  Consider the number being converted and identify knowledge gaps to provide helpful content.
  The content should be concise and easy to understand.
  `,
});

const supplementalContentFlow = ai.defineFlow(
  {
    name: 'supplementalContentFlow',
    inputSchema: SupplementalContentInputSchema,
    outputSchema: SupplementalContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
