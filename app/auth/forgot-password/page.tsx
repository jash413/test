// app/(auth)/forgot-password/page.tsx
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLoadingAPI } from '@/app/hooks/useLoadingAPI';
import EnhancedAlert from '@/components/ui/EnhancedAlert';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { fetchWithLoading } = useLoadingAPI();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setError(null)

    try {
      const response = await fetchWithLoading('/api/auth/custom-forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (response.ok) {
        setMessage(response.message)
      } else {
        setError(response.error)
      }
    } catch (err : any) {
      setError(err.toString())
    }
  }

  return (
    <>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
        Reset your password
      </h2>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Enter your email address and we&apos;ll send you a link to reset your password.
      </p>
      {message && (
        <EnhancedAlert message={message} type='success'/>
      )}
      {error && (
        <EnhancedAlert message={error} type='error'/>
      )}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="appearance-none relative block w-full px-3 py-2 border border-input placeholder-muted-foreground text-foreground rounded-md focus:outline-none focus:ring-ring focus:border-ring focus:z-10 sm:text-sm"
          placeholder="Email address"
        />
        
        <Button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
        >
          Send reset link
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <Link href="/auth/signin" className="font-medium text-primary hover:text-primary/90">
          Back to sign in
        </Link>
      </div>
    </>
  )
}