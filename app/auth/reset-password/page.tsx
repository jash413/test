// app/auth/reset-password/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import EnhancedAlert from '@/components/ui/EnhancedAlert'

import { Loader } from '@/components/ui/Loader'
import { useLoadingAPI } from '@/app/hooks/useLoadingAPI';
import { useCustomRouter } from '@/hooks/useCustomRouter'
import Link from 'next/link'

const passwordSchema = z.string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must contain at least one symbol" })

const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [verificationCode, setVerificationCode] = useState('')
  const [step, setStep] = useState<'password' | 'verification'>('password')
  const [isLoading, setIsLoading] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const searchParams = useSearchParams()
  const router = useCustomRouter()
  const token = searchParams.get('token')
  const { fetchWithLoading } = useLoadingAPI();

  const { control, handleSubmit, formState: { errors, isValid } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "all"
  })

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token')
    }
  }, [token])

  const onSubmitPassword = async (data: ResetPasswordFormData) => {
    setMessage(null)
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetchWithLoading('/api/auth/verify-reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: data.password }),
      })

      if (response.ok) {
        setMessage('Verification code sent. Please check your email or phone.')
        setStep('verification')
      } else {
        setError(response.error)
      }
    } catch (err : any) {
      setError(err.toString())
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmitVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetchWithLoading('/api/auth/complete-reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, verificationCode }),
      })

      if (response.ok) {
        setMessage('Password reset successfully. Redirecting to sign in...')
        setShowLoader(true) // Show loader before redirect
        setTimeout(() => {
          router.push('/auth/signin')
        }, 3000)
      } else {
        setError(response.error)
      }
    } catch (err : any) {
      setError(err.toString())
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {showLoader && <Loader />}
      <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
        Reset your password
      </h2>
      {message && (
        <EnhancedAlert message={message} type='success'/>
      )}
      {error && (
        <EnhancedAlert message={error} type='error'/>
      )}
      
      {step === 'password' ? (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmitPassword)}>
          <div className="relative">
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type={showPassword ? "text" : "password"}
                  className="appearance-none relative block w-full px-3 py-2 border border-input placeholder-muted-foreground text-foreground rounded-md focus:outline-none focus:ring-ring focus:border-ring focus:z-10 sm:text-sm pr-10"
                  placeholder="New password"
                />
              )}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash className="h-5 w-5 text-muted-foreground" /> : <FaEye className="h-5 w-5 text-muted-foreground" />}
            </button>
            {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
          </div>
          <div className="relative">
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type={showConfirmPassword ? "text" : "password"}
                  className="appearance-none relative block w-full px-3 py-2 border border-input placeholder-muted-foreground text-foreground rounded-md focus:outline-none focus:ring-ring focus:border-ring focus:z-10 sm:text-sm pr-10"
                  placeholder="Confirm new password"
                />
              )}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash className="h-5 w-5 text-muted-foreground" /> : <FaEye className="h-5 w-5 text-muted-foreground" />}
            </button>
            {errors.confirmPassword && <p className="mt-1 text-xs text-destructive">{errors.confirmPassword.message}</p>}
          </div>
          <Button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
            disabled={!isValid || isLoading}
          >
            {isLoading ? 'Submitting...' : 'Continue'}
          </Button>
        </form>
      ) : (
        <form className="mt-8 space-y-6" onSubmit={onSubmitVerification}>
          <Input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code"
            className="appearance-none relative block w-full px-3 py-2 border border-input placeholder-muted-foreground text-foreground rounded-md focus:outline-none focus:ring-ring focus:border-ring focus:z-10 sm:text-sm"
          />
          <Button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Reset password'}
          </Button>
        </form>
      )}
      <div className="mt-6 text-center">
        <Link href="/auth/signin" className="font-medium text-primary hover:text-primary/90">
          Return to Sign In
        </Link>
      </div>
    </>
  )
}