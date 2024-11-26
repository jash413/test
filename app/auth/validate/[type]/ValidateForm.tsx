// app/auth/validate/[type]/ValidateForm.tsx
'use client';

import { useState } from 'react';
import { useCustomRouter } from '@/hooks/useCustomRouter';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EnhancedAlert from '@/components/ui/EnhancedAlert';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PhoneInput, phoneSchema } from '@/components/forms/PhoneInput';
import { useLoadingAPI } from '@/app/hooks/useLoadingAPI';
import Link from 'next/link';

function maskValue(value: string, type: 'email' | 'phone'): string {
  if (type === 'email') {
    const [username, domain] = value.split('@');
    return `${username.slice(0, 3)}****@${domain}`;
  } else {
    return value.slice(0, 3) + '****' + value.slice(-3);
  }
}

const phoneFormSchema = z.object({
  phone: phoneSchema
});

export default function ValidateForm({ type }: { type: 'email' | 'phone' }) {
  const { data: session, update } = useSession();
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const router = useCustomRouter();
  const { fetchWithLoading } = useLoadingAPI();

  const {
    control,
    handleSubmit,
    formState: {}
  } = useForm({
    resolver: zodResolver(phoneFormSchema),
    mode: 'onChange',
    defaultValues: {
      phone: session?.user?.phone === '9999999999' ? '' : session?.user?.phone
    }
  });

  const handleSendCode = async (data?: { phone?: string }) => {
    setIsLoading(true);
    setShowLoader(true);
    try {
      const response = await fetchWithLoading(`/api/auth/send-${type}-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data ? { phone: data.phone } : {})
      });
      if (response.ok) {
        setMessage(`Verification code sent to your ${type}`);
        setError(null);
        if (data?.phone) {
          await update({
            ...session,
            user: { ...session?.user, phone: data.phone }
          });
        }
        setIsUpdatingPhone(false);
      }
    } catch (err: any) {
      setError(err.toString() || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
      setShowLoader(false);
    }
  };

  const handleVerifyCode = async () => {
    setIsLoading(true);
    setShowLoader(true);
    try {
      const response = await fetchWithLoading(`/api/auth/verify/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: verificationCode })
      });
      if (response.ok) {
        await update({
          ...session,
          user: {
            ...session?.user,
            [`${type}Verified`]: response[`${type}Verified`]
          }
        });
        router.push('/dashboard');
      } else {
        setError(response.error || 'Failed to verify code');
      }
    } catch (err: any) {
      setError(err.toString() || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
      setShowLoader(false);
    }
  };

  const valueToMask =
    type === 'email' ? session?.user?.email : session?.user?.phone;

  if (!valueToMask) return null;

  const renderPhoneInput = () => (
    <form onSubmit={handleSubmit(handleSendCode)}>
      <PhoneInput
        control={control}
        name="phone"
        placeholder="Phone number"
        className="mb-4"
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send Verification Code'}
      </Button>
    </form>
  );

  return (
    <>
      {type === 'phone' &&
      (session?.user?.phone === '9999999999' ||
        !session?.user?.phone ||
        isUpdatingPhone) ? (
        renderPhoneInput()
      ) : (
        <>
          <p className="mb-4 text-foreground">
            Verify your {type}: {maskValue(valueToMask, type)}
            {type === 'phone' && (
              <span className="ml-2">
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsUpdatingPhone(true);
                  }}
                  className="text-primary hover:text-primary/90"
                >
                  Update Phone Number
                </Link>
              </span>
            )}
          </p>
          {message && (
            <EnhancedAlert message={message} type="success" className="mb-6" />
          )}
          {error && (
            <EnhancedAlert message={error} type="error" className="mb-6" />
          )}

          <Button
            onClick={() => handleSendCode()}
            className="mb-4 w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Verification Code'}
          </Button>
          <Input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code"
            className="mb-4"
          />
          <Button
            onClick={handleVerifyCode}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </Button>
        </>
      )}
    </>
  );
}
