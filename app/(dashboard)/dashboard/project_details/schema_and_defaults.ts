// file : app/(dashboard)/dashboard/project_details/schema_and_defaults.ts

import { multiFileSchema } from '@/components/forms/MultiStep/formUtils';
import { Step } from '@/components/forms/MultiStep/MultiStepForm';
import { TooltipContent } from '@/components/forms/TooltipContext';
import * as z from 'zod';

export const projectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must be 100 characters or less'),
  description: z
    .string()
    .max(1000, 'Description must be 1000 characters or less')
    .optional()
    .describe('textarea'),
  project_type: z.enum(['NewConstruction', 'Renovation', 'Addition', 'Other'], {
    errorMap: () => ({ message: 'Please select a valid project type' })
  }),
  contract_type: z.enum(['FixedPrice', 'CostPlus', 'TimeAndMaterials'], {
    errorMap: () => ({ message: 'Please select a valid contract type' })
  }),
  status: z.enum(['NotStarted', 'InProgress', 'Completed', 'OnHold'], {
    errorMap: () => ({ message: 'Please select a valid project status' })
  }),
  address: z.string().min(1, 'Address is required').describe('address'),
  start_date: z.coerce.date().optional().describe('date'),
  end_date: z.coerce.date().optional().describe('date'),
  budget_estimated: z
    .number()
    .positive('Budget must be a positive number')
    .describe('dollar'),
  actual_spent: z
    .number()
    .nonnegative('Actual spent must be zero or positive')
    .optional()
    .describe('dollar'),
  percentage_complete: z
    .number()
    .min(0)
    .max(1, 'Percentage must be between 0 and 100')
    .optional()
    .describe('percentage'),
  lot_size_in_acres: z
    .number()
    .positive('Lot size must be a positive number')
    .optional(),
  square_footage: z
    .number()
    .int('Square footage must be a whole number')
    .positive('Square footage must be positive'),
  heated_square_footage: z
    .number()
    .int('Heated square footage must be a whole number')
    .positive('Heated square footage must be positive'),
  non_heated_square_footage: z
    .number()
    .int('Non-heated square footage must be a whole number')
    .nonnegative('Non-heated square footage must be zero or positive'),
  number_of_beds: z
    .number()
    .int('Number of bedrooms must be a whole number')
    .positive('Number of bedrooms must be positive'),
  number_of_baths: z.number().positive('Number of bathrooms must be positive'),
  notes: z
    .string()
    .max(2000, 'Notes must be 2000 characters or less')
    .optional()
    .describe('textarea'),
  exception_notes: z
    .string()
    .max(1000, 'Exception notes must be 1000 characters or less')
    .optional()
    .describe('textarea'),
  project_documents: multiFileSchema
});

// Steps definition
export const steps: Step[] = [
  {
    id: 'basicInfo',
    title: 'Basic Information',
    groups: [
      {
        title: 'Project Details',
        fields: [
          'name',
          'description',
          'project_type',
          'contract_type',
          'status'
        ],
        layout: 'single'
      }
    ]
  },
  {
    id: 'locationAndTimeline',
    title: 'Location & Timeline',
    groups: [
      {
        title: 'Address',
        fields: ['address'],
        layout: 'single'
      },
      {
        title: 'Project Dates',
        fields: ['start_date', 'end_date'],
        layout: 'double'
      }
    ]
  },
  {
    id: 'budgetAndActuals',
    title: 'Budget & Actuals',
    groups: [
      {
        title: 'Financial Details',
        fields: ['budget_estimated', 'actual_spent', 'percentage_complete'],
        layout: 'single'
      }
    ]
  },
  {
    id: 'propertyDetails',
    title: 'Property Details',
    groups: [
      {
        title: 'Size and Layout',
        fields: ['lot_size_in_acres', 'square_footage'],
        layout: 'double'
      },
      {
        title: 'Heated and Non-Heated Areas',
        fields: ['heated_square_footage', 'non_heated_square_footage'],
        layout: 'double'
      },
      {
        title: 'Rooms',
        fields: ['number_of_beds', 'number_of_baths'],
        layout: 'double'
      }
    ]
  },
  {
    id: 'additionalInfo',
    title: 'Additional Information',
    groups: [
      {
        title: 'Notes and Documents',
        fields: ['notes', 'exception_notes', 'project_documents'],
        layout: 'single'
      }
    ]
  },
  { id: 'confirm', title: 'Confirm', groups: [] }
];

// Field tooltips
export const fieldTooltips: Record<string, TooltipContent> = {
  name: {
    label: 'Project Name',
    description: 'Enter a unique name for your project.',
    example: 'Smith Family Home Renovation'
  },
  description: {
    label: 'Project Description',
    description: 'Provide a brief overview of the project scope.',
    example:
      'Complete renovation of a 1950s single-family home, including kitchen and bathroom updates.'
  },
  project_type: {
    label: 'Project Type',
    description: 'Select the category that best describes your project.',
    example: 'Renovation, New Construction, Addition, etc.'
  },
  contract_type: {
    label: 'Contract Type',
    description: 'Specify the type of contract for this project.',
    example: 'Fixed Price, Cost-Plus, Time and Materials'
  },
  status: {
    label: 'Project Status',
    description: 'Select the current status of the project.',
    example: 'Not Started, In Progress, Completed, On Hold'
  },
  start_date: {
    label: 'Start Date',
    description: 'Enter the date when the project is scheduled to begin.',
    example: 'MM/DD/YYYY format, like 01/15/2024'
  },
  end_date: {
    label: 'End Date',
    description: 'Enter the expected completion date of the project.',
    example: 'MM/DD/YYYY format, like 12/31/2024'
  },
  address: {
    label: 'Project Address',
    description: 'Enter the complete address of the project site.',
    example: '123 Main Street, Springfield, IL 62701'
  },
  budget_estimated: {
    label: 'Estimated Budget',
    description: 'Enter the total estimated budget for the project.',
    example: '250000 for $250,000'
  },
  actual_spent: {
    label: 'Actual Spent',
    description: 'Enter the amount actually spent on the project so far.',
    example: '100000 for $100,000'
  },
  percentage_complete: {
    label: 'Percentage Complete',
    description: 'Enter the estimated percentage of project completion.',
    example: '75 for 75% complete'
  },
  lot_size_in_acres: {
    label: 'Lot Size (acres)',
    description: 'Enter the size of the property lot in acres.',
    example: '0.5 for half an acre'
  },
  square_footage: {
    label: 'Total Square Footage',
    description: 'Enter the total square footage of the building.',
    example: '2500 for 2,500 sq ft'
  },
  heated_square_footage: {
    label: 'Heated Square Footage',
    description: 'Enter the square footage of heated living space.',
    example: '2000 for 2,000 sq ft'
  },
  non_heated_square_footage: {
    label: 'Non-Heated Square Footage',
    description:
      'Enter the square footage of non-heated areas (e.g., garage, unfinished basement).',
    example: '500 for 500 sq ft'
  },
  number_of_beds: {
    label: 'Number of Bedrooms',
    description: 'Enter the number of bedrooms in the property.',
    example: '3 for a 3-bedroom home'
  },
  number_of_baths: {
    label: 'Number of Bathrooms',
    description: 'Enter the number of bathrooms in the property.',
    example: '2.5 for 2 full baths and 1 half bath'
  },
  notes: {
    label: 'Additional Notes',
    description: 'Enter any additional notes or comments about the project.',
    example: 'Client prefers eco-friendly materials where possible.'
  },
  exception_notes: {
    label: 'Exception Notes',
    description:
      'Enter notes about any exceptions or special considerations for the project.',
    example: 'Possible delay due to custom window delivery.'
  },
  project_documents: {
    label: 'Project Documents',
    description:
      'Upload relevant documents for the project (max 5 files, 5MB each).',
    example: 'Floor plans, contracts, permits, etc.'
  }
};

// Default values
export const defaultValues = {
  name: 'Smith Family Home Renovation',
  description:
    'Complete renovation of a 1950s single-family home, including kitchen and bathroom updates, new roofing, and energy-efficient windows.',
  project_type: 'Renovation',
  contract_type: 'FixedPrice',
  status: 'InProgress',
  address: '1234 Maple Street, Springfield, IL 62701',
  start_date: '2023-09-15T00:00:00.000Z',
  end_date: '2024-03-15T00:00:00.000Z',
  budget_estimated: 250000,
  actual_spent: 100000,
  percentage_complete: 0.4,
  lot_size_in_acres: 0.25,
  square_footage: 2200,
  heated_square_footage: 1800,
  non_heated_square_footage: 400,
  number_of_beds: 3,
  number_of_baths: 2.5,
  notes:
    'Client has requested eco-friendly materials where possible. Weekly progress meetings scheduled for Fridays at 2 PM.',
  exception_notes:
    'Potential delay in custom kitchen cabinets delivery. Exploring alternative options.',
  project_documents: []
};
