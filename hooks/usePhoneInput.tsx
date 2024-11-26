// File: hooks/usePhoneInput.ts
import { useState, ChangeEvent } from 'react'

export const usePhoneInput = (initialValue: string = '') => {
  const [value, setValue] = useState(initialValue)

  const formatPhoneNumber = (input: string) => {
    const cleanedInput = input.replace(/\D/g, '')
    let formattedInput = cleanedInput
    if (cleanedInput.length > 3) {
      formattedInput = `(${cleanedInput.slice(0, 3)}) ${cleanedInput.slice(3)}`
    }
    if (cleanedInput.length > 6) {
      formattedInput = `(${cleanedInput.slice(0, 3)}) ${cleanedInput.slice(3, 6)}-${cleanedInput.slice(6, 10)}`
    }
    return formattedInput
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(event.target.value)
    setValue(formattedValue)
  }

  return {
    value,
    onChange: handleChange,
  }
}