// file : app/onboarding/homeowner/schema_and_defaults.ts

import { singleFileSchema } from '@/components/forms/MultiStep/formUtils';
import { Step } from '@/components/forms/MultiStep/MultiStepForm';
import { TooltipContent } from '@/components/forms/TooltipContext';
import * as z from 'zod';

// Schema definition
export const homeownerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  project_type: z.enum(['NewConstruction', 'Renovation', 'Addition', 'Other'], {
    errorMap: () => ({ message: 'Please select a valid project type' })
  }),
  project_description: z
    .string()
    .min(10, 'Please provide a brief description of your project')
    .optional()
    .describe('textarea'),
  address: z.string().min(1, 'Address is required').describe('address'),
  start_date: z.coerce.date().optional().describe('date'),
  square_footage: z
    .number()
    .int('Square footage must be a whole number')
    .positive('Square footage must be positive'),
  budget_estimated: z
    .number()
    .positive('Budget must be a positive number')
    .describe('dollar'),
  notes: z
    .string()
    .max(1000, 'Notes must not exceed 1000 characters')
    .optional()
    .describe('textarea'),
  project_documents: singleFileSchema
});

// Steps definition
export const homeOwnerFormSteps: Step[] = [
  {
    id: 'projectDetails',
    title: 'Project Details',
    groups: [
      {
        title: 'Project Information',
        fields: ['name', 'project_type', 'project_description', 'address'],
        layout: 'single'
      }
    ]
  },
  {
    id: 'budgetAndSize',
    title: 'Budget & Size',
    groups: [
      {
        title: 'Budget and Size Information',
        fields: ['square_footage', 'budget_estimated'],
        layout: 'double'
      },
      {
        title: 'Project Timeline',
        fields: ['start_date'],
        layout: 'single'
      }
    ]
  },
  {
    id: 'notesAndDocuments',
    title: 'Notes & Documents',
    groups: [
      {
        title: 'Additional Notes',
        fields: ['notes'],
        layout: 'single'
      },
      {
        title: 'Project Documents',
        fields: ['project_documents'],
        layout: 'single'
      }
    ]
  },
  { id: 'confirm', title: 'Confirm', groups: [] }
];

// Field tooltips
export const homeOwnerFormfieldTooltips: Record<string, TooltipContent> = {
  name: {
    label: 'Project Name',
    description: 'Give your project a name to help you identify it later',
    example: 'My Home Renovation'
  },
  project_type: {
    label: 'Project Type',
    description: 'Select the category that best describes your project',
    example: 'Renovation, New Construction, Addition, etc.'
  },
  project_description: {
    label: 'Project Description',
    description: 'Provide a brief overview of your project',
    example:
      'Complete renovation of a 1950s single-family home, including kitchen and bathroom updates.'
  },
  address: {
    label: 'Project Address',
    description: 'Enter the complete address where the project will take place',
    example: '123 Main Street, Anytown, ST 12345'
  },
  start_date: {
    label: 'Start Date',
    description: 'When do you hope to start your project?',
    example: '2023-09-01'
  },
  square_footage: {
    label: 'Square Footage',
    description: 'Enter the approximate square footage of the project area',
    example: '2000'
  },
  budget_estimated: {
    label: 'Estimated Budget',
    description: 'Enter your estimated budget for the project',
    example: '50000 for $50,000'
  },
  notes: {
    label: 'Additional Notes',
    description:
      'Add any additional information or special requirements for your project',
    example: 'Prefer eco-friendly materials. Need to complete kitchen first.'
  },
  project_documents: {
    label: 'Project Documents',
    description: 'Upload any relevant project documents or design files',
    example: 'Floor plans, design sketches, inspiration photos, etc.'
  }
};

export const homeOwnerFormdefaultValues = {
  project_type: 'NewConstruction',
  project_description: 'A new construction project.',
  address: '123 Main St, Anytown, ST 12345',
  start_date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
  square_footage: 2000, // Default square footage in square feet
  budget_estimated: 500000, // Default budget in USD
  notes: ''
};
