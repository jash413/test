// components/forms/PhoneInput.tsx
import React from 'react'
import { Input } from "@/components/ui/input"
import { useController, Control } from 'react-hook-form'
import { z } from 'zod'

export const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/

export const phoneSchema = z.string().regex(phoneRegex, { message: "Invalid phone number. Please enter a 10-digit number." })

interface PhoneInputProps {
  control: Control<any>
  name: string
  placeholder?: string
  className?: string
}

export const formatPhoneNumber = (value?: string) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, '');
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

export function PhoneInput({ control, name, placeholder = "Phone number", className = "" }: PhoneInputProps) {
  const {
    field: { onChange, value, ...rest },
    fieldState: { error }
  } = useController({
    name,
    control,
    rules: { required: true },
  })

  return (
    <div>
      <Input
        {...rest}
        type="tel"
        autoComplete="tel"
        className={`appearance-none relative block w-full px-3 py-2 border border-input placeholder-muted-foreground text-foreground rounded-md focus:outline-none focus:ring-ring focus:border-ring focus:z-10 sm:text-sm ${className}`}
        placeholder={placeholder}
        value={formatPhoneNumber(value)}
        onChange={(e) => {
          const formatted = formatPhoneNumber(e.target.value);
          onChange(formatted);
        }}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error.message}</p>}
    </div>
  )
}