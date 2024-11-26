// file : app/onboarding/business/schema_and_defaults.ts

import { singleFileSchema } from '@/components/forms/MultiStep/formUtils';
import { Step } from '@/components/forms/MultiStep/MultiStepForm';
import { TooltipContent } from '@/components/forms/TooltipContext';
import * as z from 'zod';

export const businessSchema = z.object({
  type: z.enum(['GC', 'SUB'], {
    required_error: 'Business type is required'
  }),
  name: z.string().min(1, 'Legal name is required'),
  structure: z.enum(
    ['Sole Proprietorship', 'LLC', 'Corporation', 'Partnership'],
    { required_error: 'Business structure is required' }
  ),
  years_in_business: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: 'Must be a valid number'
    })
    .transform((val) => Number(val))
    .refine((val) => val >= 0, {
      message: 'Years in business must be 0 or greater'
    }),
  description: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  address: z.string().min(1, 'Address is required').describe('address'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  specializations: z
    .array(z.string())
    .min(1, 'At least one specialization is required')
    .describe('tags'),
  trade_types: z
    .array(z.string())
    .min(1, 'At least one trade type is required')
    .describe('tags'),
  license_info: z.string().min(1, 'License number is required'),
  insurance_info: z.string().min(1, 'Insurance provider is required'),
  workers_comp_info: z
    .string()
    .min(1, "Workers' compensation provider is required"),
  tax_id: z.string().min(1, 'Tax ID is required'),
  license_document: singleFileSchema.optional(),
  insurance_document: singleFileSchema.optional()
});

export const steps: Step[] = [
  {
    id: 'businessInfo',
    title: 'Business Information',
    groups: [
      {
        title: 'Basic Information',
        fields: [
          'type',
          'name',
          'structure',
          'years_in_business',
          'description'
        ],
        layout: 'single'
      }
    ]
  },
  {
    id: 'contactInfo',
    title: 'Contact Information',
    groups: [
      {
        title: 'Contact Information',
        fields: ['website', 'address', 'email', 'phone'],
        layout: 'single'
      }
    ]
  },
  {
    id: 'specializationsAndTrades',
    title: 'Specializations and Trades',
    groups: [
      {
        title: 'Business Specializations',
        fields: ['specializations'],
        layout: 'single'
      },
      {
        title: 'Trade Types',
        fields: ['trade_types'],
        layout: 'single'
      }
    ]
  },
  {
    id: 'legalInfo',
    title: 'Legal Information',
    groups: [
      {
        title: 'Licensing',
        fields: ['license_info', 'license_document'],
        layout: 'double'
      },
      {
        title: 'Insurance',
        fields: ['insurance_info', 'insurance_document'],
        layout: 'double'
      },
      {
        title: 'Workers Compensation Provider',
        fields: ['workers_comp_info'],
        layout: 'single'
      },
      {
        title: 'Tax Information',
        fields: ['tax_id'],
        layout: 'single'
      }
    ]
  },
  { id: 'confirm', title: 'Confirm', groups: [] }
];

export const fieldTooltips: Record<string, TooltipContent> = {
  type: {
    label: 'Business Type',
    description:
      'Select the primary role of your business in the construction industry.',
    example:
      'General Contractor: Manages entire projects. Subcontractor: Specializes in specific trades.'
  },
  name: {
    label: 'Legal Business Name',
    description:
      'Enter the official name of your business as registered with government authorities.',
    example: 'Smith Construction LLC or Johnson Building Services Inc.'
  },
  structure: {
    label: 'Business Structure',
    description:
      'Choose the legal structure of your business. This affects taxes and liability.',
    example:
      'LLC: Limited Liability Company, Corp: Corporation, Sole Prop: Sole Proprietorship'
  },
  years_in_business: {
    label: 'Years in Business',
    description: 'Enter the number of years your business has been operating.',
    example: '5 (for a business operating since 2018)'
  },
  description: {
    label: 'Business Description',
    description: 'Provide a brief description of your business.',
    example:
      'A sample construction business specializing in residential and commercial projects.'
  },
  website: {
    label: 'Website',
    description:
      "Enter your business website URL. Leave blank if you don't have one.",
    example: 'https://www.smithconstruction.com'
  },
  address: {
    label: 'Business Address',
    description:
      'Provide the full mailing address of your business headquarters.',
    example: '123 Main Street, Suite 456, Anytown, ST 12345'
  },
  email: {
    label: 'Business Email',
    description: 'Enter the primary email address for business communications.',
    example: 'info@smithconstruction.com'
  },
  phone: {
    label: 'Business Phone',
    description: 'Provide the main contact number for your business.',
    example: '(555) 123-4567'
  },
  specializations: {
    label: 'Specializations',
    description: 'Select all areas in which your business specializes.',
    example: 'Residential Construction, Commercial Renovation, Electrical Work'
  },
  trade_types: {
    label: 'Trade Types',
    description: 'Select all the trade types your business is involved in.',
    example: 'Carpentry, Electrical, Plumbing, etc.'
  },
  license_info: {
    label: 'License Number',
    description:
      "Enter your business's professional license or registration number.",
    example: 'LIC-123456 or REG-789012'
  },
  insurance_info: {
    label: 'Insurance Provider',
    description:
      'Enter the name of your business liability insurance provider.',
    example: 'SafeGuard Insurance Co. or BuilderShield Ltd.'
  },
  workers_comp_info: {
    label: "Workers' Compensation Provider",
    description:
      "Provide the name of your workers' compensation insurance provider.",
    example: 'WorkerCare Insurance or StateFund Compensation'
  },
  tax_id: {
    label: 'Tax ID',
    description:
      "Enter your business's federal tax identification number (EIN).",
    example: '12-3456789'
  },
  license_document: {
    label: 'License Document',
    description: 'Upload a scanned copy or photo of your business license.',
    example: 'Accepted formats: PDF, JPG, PNG. Max size: 5MB'
  },
  insurance_document: {
    label: 'Insurance Document',
    description: 'Upload proof of your business liability insurance.',
    example: 'Accepted formats: PDF, JPG, PNG. Max size: 5MB'
  }
};

export const defaultValues = {
  type: 'GC',
  name: 'Smith Construction LLC',
  structure: 'LLC',
  years_in_business: '5',
  description: 'A sample construction business',
  website: 'https://www.smithconstruction.com',
  address: '123 Main Street, Suite 456, Anytown, ST 12345',
  email: 'info@smithconstruction.com',
  phone: '(555) 123-4567',
  specializations: ['Residential Construction', 'Commercial Renovation'],
  trade_types: ['General Contractor', 'Carpenter', 'Painter'],
  license_info: 'LIC-123456',
  insurance_info: 'SafeGuard Insurance Co.',
  workers_comp_info: 'WorkerCare Insurance',
  tax_id: '12-3456789',
  license_document: null,
  insurance_document: null
};
