// file : components/forms/MultiStep/InputFields.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { z } from 'zod';
import { DollarField, PercentageField, DateField } from './SpecializedFields';
import { GooglePlacesAutocomplete } from '../GooglePlacesAutoComplete';
import { MultiFilesField, SingleFileField } from './FileFields';

export interface FieldProps {
  label: string;
  name: string;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  options?: string[];
  accept?: string;
  onFileSelect?: (files: File[]) => void;
  multiple?: boolean;
  isTextarea?: boolean;
  onAddCustomOption?: (newOption: string) => void;
  onAddCustomTag?: (newTag: string) => void;
  type?: string;
}

export const TextField: React.FC<FieldProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  onFocus,
  onBlur,
  type = 'text' // Add this line with a default value of 'text'
}) => (
  <div className="mb-4">
    <Label
      htmlFor={name}
      className="mb-1 block text-sm font-medium text-gray-700"
    >
      {label}
    </Label>
    <Input
      id={name}
      name={name}
      type={type} // Use the type prop here
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      className="mt-1 block w-full rounded-md border-gray-300 
                    shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
    />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

export const TextAreaField: React.FC<FieldProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  onFocus,
  onBlur
}) => (
  <div className="mb-4">
    <Label
      htmlFor={name}
      className="mb-1 block text-sm font-medium text-gray-700"
    >
      {label}
    </Label>
    <Textarea
      id={name}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      rows={4}
      className="mt-1 block w-full rounded-md 
                border-gray-300 shadow-sm focus:border-indigo-500 
                focus:ring-indigo-500 sm:text-sm"
    />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

export const CustomSelectField: React.FC<FieldProps> = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  onFocus,
  onBlur,
  onAddCustomOption
}) => {
  const [localOptions, setLocalOptions] = useState(options);
  const [newOption, setNewOption] = useState('');

  useEffect(() => {
    setLocalOptions(options);
  }, [options]);

  const handleAddOption = () => {
    if (newOption && !localOptions.includes(newOption)) {
      const updatedOptions = [...localOptions, newOption];
      setLocalOptions(updatedOptions);
      onAddCustomOption?.(newOption);
      onChange(newOption);
      setNewOption('');
    }
  };

  return (
    <div className="mb-4">
      <Label
        htmlFor={name}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label}
      </Label>
      <Select
        onValueChange={(newValue) => {
          // console.log(`Select value changed to: ${newValue}`);
          if (newValue) {
            // Only update if the new value is not empty
            onChange(newValue);
          }
        }}
        value={value}
        onOpenChange={(open) => {
          if (open) {
            onFocus?.();
          } else {
            onBlur?.();
            // Ensure the current value is maintained when closing the dropdown
            onChange(value);
          }
        }}
      >
        <SelectTrigger className="mt-1 w-full">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {localOptions.map((option, index) => (
            <SelectItem key={`${option}-${index}`} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      <div className="mt-2 flex items-center space-x-2">
        <Input
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          placeholder="Add new option"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddOption();
            }
          }}
        />
        <Button onClick={handleAddOption} type="button">
          Add
        </Button>
      </div>
    </div>
  );
};

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  error?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  onFocus,
  onBlur
}) => {
  return (
    <div className="mb-4">
      <Label
        htmlFor={name}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label}
      </Label>
      <Select
        onValueChange={(newValue) => {
          if (newValue) {
            onChange(newValue);
          }
        }}
        value={value}
        onOpenChange={(open) => {
          if (open) {
            onFocus?.();
          } else {
            onBlur?.();
          }
        }}
      >
        <SelectTrigger className="mt-1 w-full">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export const MultiSelectField: React.FC<FieldProps> = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  onFocus,
  onBlur
}) => {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault(); // Prevent form submission
    // console.log('in add new tag', newTag, onChange);
    if (newTag && !value.includes(newTag)) {
      onChange([...value, newTag]);
      setNewTag('');
    }
  };

  return (
    <div className="mb-4">
      <Label htmlFor={name}>{label}</Label>
      <div className="mb-2 flex flex-wrap gap-2">
        {value.map((tag: string, index: number) => (
          <Badge key={index} variant="secondary">
            {tag}
            <button
              onClick={(e) => {
                e.preventDefault();
                onChange(value.filter((t: string) => t !== tag));
              }}
            >
              ×
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Add a tag"
          onKeyPress={(e) => e.key === 'Enter' && handleAddTag(e)}
        />
        <Button type="button" onClick={handleAddTag}>
          Add
        </Button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((tag: string) => (
          <Button
            key={tag}
            variant="outline"
            size="sm"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (!value.includes(tag)) onChange([...value, tag]);
            }}
          >
            {tag}
          </Button>
        ))}
      </div>
    </div>
  );
};

export const BooleanField: React.FC<FieldProps> = ({
  label,
  name,
  value,
  onChange,
  error
}) => (
  <div className="mb-4 flex items-center justify-between">
    <Label htmlFor={name} className="text-sm font-medium text-gray-700">
      {label}
    </Label>
    <Switch id={name} checked={value} onCheckedChange={onChange} />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

interface Link {
  url: string;
  description: string;
}

export const LinksField: React.FC<FieldProps> = ({
  label,
  name,
  value,
  onChange,
  error
}) => {
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkDescription, setNewLinkDescription] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddLink = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent form submission
    if (newLinkUrl && newLinkDescription) {
      onChange([
        ...value,
        { url: newLinkUrl, description: newLinkDescription }
      ]);
      setNewLinkUrl('');
      setNewLinkDescription('');
    }
  };

  const handleEditLink = (index: number) => {
    setEditingIndex(index);
    setNewLinkUrl(value[index].url);
    setNewLinkDescription(value[index].description);
  };

  const handleUpdateLink = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent form submission
    if (editingIndex !== null) {
      const updatedLinks = [...value];
      updatedLinks[editingIndex] = {
        url: newLinkUrl,
        description: newLinkDescription
      };
      onChange(updatedLinks);
      setEditingIndex(null);
      setNewLinkUrl('');
      setNewLinkDescription('');
    }
  };

  const handleDeleteLink = (
    index: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault(); // Prevent form submission
    onChange(value.filter((_: Link, i: number) => i !== index));
  };

  return (
    <div className="mb-4">
      <Label htmlFor={name}>{label}</Label>
      {value.map((link: Link, index: number) => (
        <div key={index} className="mt-2 flex items-center justify-between">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-grow truncate text-blue-600 hover:underline"
          >
            {link.description}
          </a>
          <div className="ml-2 flex-shrink-0">
            <Button
              onClick={(e) => handleEditLink(index)}
              size="sm"
              type="button"
            >
              Edit
            </Button>
            <Button
              onClick={(e) => handleDeleteLink(index, e)}
              size="sm"
              variant="destructive"
              type="button"
              className="ml-2"
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
      <div className="mt-2 space-y-2">
        <Input
          placeholder="URL"
          value={newLinkUrl}
          onChange={(e) => setNewLinkUrl(e.target.value)}
        />
        <Input
          placeholder="Description"
          value={newLinkDescription}
          onChange={(e) => setNewLinkDescription(e.target.value)}
        />
        <Button
          onClick={editingIndex !== null ? handleUpdateLink : handleAddLink}
          type="button"
        >
          {editingIndex !== null ? 'Update Link' : 'Add Link'}
        </Button>
      </div>
    </div>
  );
};

// Custom DeleteIcon component
export const renderField = (
  fieldName: string,
  fieldSchema: z.ZodTypeAny,
  props: FieldProps
) => {
  // Unwrap ZodEffects if present
  const unwrappedSchema =
    fieldSchema instanceof z.ZodEffects ? fieldSchema._def.schema : fieldSchema;

  // Safely get the description
  const description =
    unwrappedSchema && unwrappedSchema._def
      ? unwrappedSchema._def.description
      : undefined;

  // Handle different field types
  if (description === 'textarea') {
    return <TextAreaField {...props} />;
  } else if (description === 'custom_select') {
    return <CustomSelectField {...props} />;
  } else if (description === 'tags') {
    return <MultiSelectField {...props} />;
  } else if (description === 'links') {
    return <LinksField {...props} />;
  } else if (description === 'single-file') {
    return <SingleFileField {...props} />;
  } else if (description === 'multi-file') {
    return <MultiFilesField {...props} />;
  } else if (description === 'dollar') {
    return <DollarField {...props} />;
  } else if (description === 'percentage') {
    return <PercentageField {...props} />;
  } else if (description === 'date') {
    return <DateField {...props} />;
  } else if (unwrappedSchema instanceof z.ZodBoolean) {
    return <BooleanField {...props} />;
  } else if (description === 'address') {
    return <GooglePlacesAutocomplete {...props} />;
  } else if (
    unwrappedSchema instanceof z.ZodString ||
    unwrappedSchema instanceof z.ZodEffects
  ) {
    return <TextField {...props} />;
  } else if (unwrappedSchema instanceof z.ZodEnum) {
    const options = unwrappedSchema._def.values;
    return <SelectField {...props} options={options} />;
  } else if (unwrappedSchema instanceof z.ZodNumber) {
    return <TextField {...props} type="number" />;
  }

  // Default to TextField if type is unknown
  console.warn(
    `Unknown field type for field ${fieldName}. Defaulting to TextField.`
  );
  return <TextField {...props} />;
};
