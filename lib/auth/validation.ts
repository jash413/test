import { isValidPhoneNumber } from 'libphonenumber-js'

export async function validateEmail(email: string): Promise<boolean> {
  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
      return false
  } else 
      return true
}

export async function validatePhone(phone: string): Promise<boolean> {
  // Use libphonenumber-js for comprehensive phone number validation
  if (!isValidPhoneNumber(phone)) {
    return false
  } else 
      return true
}