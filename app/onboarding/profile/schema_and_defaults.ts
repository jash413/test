// file : app/onboarding/profile/schema_and_defaults.ts

import { singleFileSchema } from '@/components/forms/MultiStep/formUtils';
import { Step } from '@/components/forms/MultiStep/MultiStepForm';
import { TooltipContent } from '@/components/forms/TooltipContext';
import * as z from 'zod';

// Schema definition
export const profileSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' }),
  bio: z
    .string()
    .max(500, { message: 'Bio must not exceed 500 characters' })
    .optional()
    .describe('textarea'),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  social_media_links: z
    .object({
      facebook: z
        .string()
        .url('Invalid Facebook URL')
        .optional()
        .or(z.literal('')),
      twitter: z
        .string()
        .url('Invalid Twitter URL')
        .optional()
        .or(z.literal('')),
      linkedin: z
        .string()
        .url('Invalid LinkedIn URL')
        .optional()
        .or(z.literal(''))
    })
    .optional(),
  home_owner_interests: z
    .string()
    .max(500, { message: 'Interests must not exceed 500 characters' })
    .optional()
    .describe('textarea'),
  address: z.string().min(1, 'Address is required').describe('address'),
  date_of_birth: z.string().optional().describe('date'),
  profile_image: singleFileSchema.optional()
});

// Steps definition
export const profileSteps: Step[] = [
  {
    id: 'basicInfo',
    title: 'Basic Info',
    groups: [
      {
        title: 'Basic Information',
        fields: ['name', 'bio', 'profile_image'],
        layout: 'single'
      }
    ]
  },
  {
    id: 'socialMedia',
    title: 'Social Media',
    groups: [
      {
        title: 'Social Media Links',
        fields: [
          'website',
          'social_media_links.facebook',
          'social_media_links.twitter',
          'social_media_links.linkedin'
        ],
        layout: 'single'
      }
    ]
  },
  {
    id: 'address',
    title: 'Address & DOB',
    groups: [
      {
        title: 'Address and Date of Birth',
        fields: ['address', 'date_of_birth'],
        layout: 'single'
      }
    ]
  },
  {
    id: 'interests',
    title: 'Interests',
    groups: [
      {
        title: 'Home Owner Interests',
        fields: ['home_owner_interests'],
        layout: 'single'
      }
    ]
  },
  { id: 'confirm', title: 'Confirm', groups: [] }
];

// Field tooltips
export const profileFieldTooltips: Record<string, TooltipContent> = {
  name: {
    label: 'Name',
    description:
      "Enter your full name as you'd like it to appear on your profile.",
    example: 'John Doe'
  },
  bio: {
    label: 'Bio',
    description:
      'A brief description about yourself. This will be visible on your public profile.',
    example:
      'Passionate homeowner with a love for DIY projects and sustainable living.'
  },
  website: {
    label: 'Website',
    description: 'Your personal or professional website URL.',
    example: 'https://www.johndoe.com'
  },
  'social_media_links.facebook': {
    label: 'Facebook',
    description: 'Your Facebook profile URL.',
    example: 'https://www.facebook.com/johndoe'
  },
  'social_media_links.twitter': {
    label: 'Twitter',
    description: 'Your Twitter profile URL.',
    example: 'https://www.twitter.com/johndoe'
  },
  'social_media_links.linkedin': {
    label: 'LinkedIn',
    description: 'Your LinkedIn profile URL.',
    example: 'https://www.linkedin.com/in/johndoe'
  },
  address: {
    label: 'Address',
    description: 'Your full mailing address.',
    example: '123 Main St, Anytown, ST 12345'
  },
  date_of_birth: {
    label: 'Date of Birth',
    description: 'Your date of birth in YYYY-MM-DD format.',
    example: '1990-01-01'
  },
  home_owner_interests: {
    label: 'Your Interests',
    description:
      'List your interests related to home ownership and improvement.',
    example: 'Gardening, Solar Energy, Smart Home Technology'
  },
  profile_image: {
    label: 'Profile Image',
    description:
      'Upload a profile picture. This will be visible on your public profile.',
    example:
      'A clear, professional headshot is recommended. Max size: 5MB, Formats: JPG, PNG'
  }
};
