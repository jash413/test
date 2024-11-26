// file : app/(dashboard)/dashboard/project_details/schema_and_defaults.ts

import {
  multiFileSchema,
  linkSchema
} from '@/components/forms/MultiStep/formUtils';
import { Step } from '@/components/forms/MultiStep/MultiStepForm';
import { TooltipContent } from '@/components/forms/TooltipContext';
import * as z from 'zod';

import { INSPIRATION_INITIAL_CATEGORIES } from '@/constants/values';

export const inspirationSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less'),
  description: z
    .string()
    .max(1000, 'Description must be 1000 characters or less')
    .optional()
    .describe('textarea'),
  category: z
    .enum(INSPIRATION_INITIAL_CATEGORIES as [string, ...string[]])
    .or(z.string())
    .describe('custom_select'),
  tags: z
    .array(z.string())
    .min(1, 'At least one tag is required')
    .describe('tags'),
  links: z.array(linkSchema).describe('links'),
  notes: z
    .string()
    .max(1000, 'Notes must be 1000 characters or less')
    .optional()
    .describe('textarea'),
  is_private: z.boolean(),
  inspiration_images: multiFileSchema
});

export const inspration_steps: Step[] = [
  {
    id: 'basicInfo',
    title: 'Basic Information',
    groups: [
      {
        title: 'Inspiration Details',
        fields: ['title', 'description', 'category', 'is_private'],
        layout: 'single' as const
      }
    ]
  },
  {
    id: 'tagsAndLinks',
    title: 'Tags and Links',
    groups: [
      {
        title: 'Tags',
        fields: ['tags'],
        layout: 'single' as const
      },
      {
        title: 'Related Links',
        fields: ['links'],
        layout: 'single' as const
      }
    ]
  },
  {
    id: 'notesAndUpload',
    title: 'Notes and Upload',
    groups: [
      {
        title: 'Additional Notes',
        fields: ['notes'],
        layout: 'single' as const
      },
      {
        title: 'Image Upload',
        fields: ['inspiration_images'],
        layout: 'single' as const
      }
    ]
  },
  { id: 'confirm', title: 'Confirm', groups: [] }
];

export const fieldTooltips: Record<string, TooltipContent> = {
  title: {
    label: 'Inspiration Title',
    description: 'Enter a unique title for your inspiration.',
    example: 'Modern Minimalist Kitchen'
  },
  description: {
    label: 'Description',
    description: 'Provide a brief description of the inspiration.',
    example: 'A sleek kitchen design with clean lines and minimal clutter.'
  },
  category: {
    label: 'Category',
    description: 'Select or enter a category for this inspiration.',
    example: 'Kitchen, Bathroom, Living Room, etc.'
  },
  tags: {
    label: 'Tags',
    description: 'Add relevant tags to help categorize your inspiration.',
    example: 'modern, minimalist, eco-friendly'
  },
  links: {
    label: 'Related Links',
    description: 'Add links to related resources or products.',
    example: 'https://example.com/modern-kitchen-ideas'
  },
  notes: {
    label: 'Additional Notes',
    description: 'Add any additional notes or thoughts about this inspiration.',
    example: 'Consider using matte finishes for a more subdued look.'
  },
  is_private: {
    label: 'Private Inspiration',
    description: 'Toggle to make this inspiration private or public.',
    example: 'ON for private, OFF for public'
  },
  inspiration_images: {
    label: 'Inspiration Images',
    description: 'Upload an image that represents your inspiration.',
    example: 'Kitchen layout photo, material sample image, etc.'
  }
};

export const defaultValues = {
  title: 'Modern Minimalist Kitchen Design',
  description:
    'A sleek and functional kitchen design featuring clean lines, neutral colors, and smart storage solutions.',
  category: 'Kitchen',
  tags: ['Modern', 'Space-saving'],
  links: [
    {
      url: 'https://example.com/minimalist-kitchen-ideas',
      description: 'Minimalist Kitchen Design Gallery'
    },
    {
      url: 'https://example.com/smart-kitchen-appliances',
      description: 'Top Smart Appliances for Modern Kitchens'
    }
  ],
  notes:
    'Consider incorporating hidden storage solutions and integrating smart home technology.',
  is_private: false,
  inspiration_images: []
};
