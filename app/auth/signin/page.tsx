//file : app/auth/signin/page.tsx

'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Loader } from '@/components/ui/Loader';
import { useSearchParams } from 'next/navigation';
import EnhancedAlert from '@/components/ui/EnhancedAlert';
import { useCustomRouter } from '@/hooks/useCustomRouter';
import Link from 'next/link';

const passwordSchema = z.string();
// .min(8, { message: 'Password must be at least 8 characters long' })
// .regex(/[A-Z]/, {
//   message: 'Password must contain at least one uppercase letter'
// })
// .regex(/[!@#$%^&*(),.?":{}|<>]/, {
//   message: 'Password must contain at least one symbol'
// });

const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: passwordSchema
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const router = useCustomRouter();

  const searchParams = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: 'all',
    defaultValues: {
      email: 'john@example.com',
      password: 'Test@12312'
    }
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password
      });
      if (result?.error) {
        setServerError('Invalid email or password');
        setIsLoading(false);
      } else if (result?.ok) {
        setShowLoader(true); // Show loader before redirect
        const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
        router.push(callbackUrl);
      } else {
        setServerError('An unexpected error occurred');
      }
    } catch (error: any) {
      setServerError(error.toString());
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'apple') => {
    setIsLoading(true);
    try {
      const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
      await signIn(provider, { callbackUrl });
    } catch (error) {
      setServerError(
        `An error occurred during ${provider} sign in. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showLoader && <Loader />}
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Sign in to your account
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Or{' '}
        <Link
          href="/auth/signup"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          sign up for an account
        </Link>
      </p>
      {serverError && <EnhancedAlert message={serverError} type="error" />}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Input
            id="email"
            {...register('email')}
            type="email"
            autoComplete="email"
            className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="Email address"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div className="relative">
          <Input
            id="password"
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pr-10 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="Password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <FaEyeSlash className="h-5 w-5 text-gray-400" />
            ) : (
              <FaEye className="h-5 w-5 text-gray-400" />
            )}
          </button>
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link
              href="/auth/forgot-password"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          // disabled={!isValid || isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
            onClick={() => handleOAuthSignIn('google')}
            disabled={isLoading}
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            <span>Google</span>
          </Button>
          <Button
            variant="outline"
            className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-900"
            onClick={() => handleOAuthSignIn('apple')}
            disabled={isLoading}
          >
            <FaApple className="mr-2 h-5 w-5" />
            <span>Apple</span>
          </Button>
        </div>
      </div>
    </>
  );
}
