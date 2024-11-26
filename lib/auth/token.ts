import crypto from 'crypto'

export function generateVerificationToken(): string {
  // Generate a random token
  return crypto.randomBytes(32).toString('hex')
}

export function generateTemporaryToken(): string {
  // Generate a shorter, temporary token (e.g., for email verification)
  return crypto.randomBytes(3).toString('hex').toUpperCase()
}

export function generateResetToken(): string {
  // Generate a token for password reset
  return crypto.randomBytes(20).toString('hex')
}

export function isTokenExpired(expiryDate: Date): boolean {
  return expiryDate.getTime() < Date.now()
}

export function generateExpiryDate(minutes: number): Date {
  return new Date(Date.now() + minutes * 60 * 1000)
}