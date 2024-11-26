// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/auth';

const allowedApiPathsWithoutAuth: string[] = [
  '/api/auth',
  '/api/markets',
  '/api/auth/reset-password'
];

const publicPaths = [
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-phone'
];
const validationPaths = ['/auth/validate'];
const validationApiPaths = [
  '/api/auth/verify',
  '/api/auth/send-email-code',
  '/api/auth/send-phone-code'
];
const profilePath = '/onboarding/profile';
const onboardingPath = '/onboarding';
const genericModelApi = '/api/generic-model/';

export async function middleware(request: NextRequest) {
  console.log(' in middleware ' + request.url);
  const { nextUrl } = request;
  const isPublicPath =
    publicPaths.some((path) => nextUrl.pathname.startsWith(path)) ||
    nextUrl.pathname === '/';
  const isValidationPath = validationPaths.some((path) =>
    nextUrl.pathname.startsWith(path)
  );
  const isValidationApiPath = validationApiPaths.some((path) =>
    nextUrl.pathname.startsWith(path)
  );
  const isApiRoute = nextUrl.pathname.startsWith('/api');
  const isApiWithoutAuthRoute = allowedApiPathsWithoutAuth.some(
    (path: string) => nextUrl.pathname.startsWith(path)
  );
  const isProfilePath = nextUrl.pathname.startsWith(profilePath);
  const isOnboardingPath = nextUrl.pathname.startsWith(onboardingPath);
  const isGenericModelApi = nextUrl.pathname.startsWith(genericModelApi);

  // Add this function to check if the request is for an image
  function isImageRequest(pathname: string): boolean {
    return (
      pathname.startsWith('/_next/image') ||
      pathname.match(/\.(jpg|jpeg|png|gif|svg)$/i) !== null
    );
  }

  if (isImageRequest(nextUrl.pathname)) {
    console.log(`Image request detected: ${nextUrl.pathname}`);
    return NextResponse.next();
  }

  // Allow all auth API routes and public paths without session check
  if (isApiWithoutAuthRoute || isPublicPath) {
    return NextResponse.next();
  }

  const session = await auth();
  // Handle API routes separately
  if (isApiRoute || isGenericModelApi) {
    return handleApiRoute(request, session);
  }

  // Redirect unauthenticated users to sign in for all non-public paths
  if (!session) {
    const encodedCallbackUrl = encodeURIComponent(
      nextUrl.pathname + nextUrl.search
    );
    return NextResponse.redirect(
      new URL(`/auth/signin?callbackUrl=${encodedCallbackUrl}`, request.url)
    );
  }

  // Check for validation status
  if (!session.user.phoneVerified && !isValidationPath) {
    return NextResponse.redirect(new URL('/auth/validate/phone', request.url));
  }

  if (!session.user.emailVerified && !isValidationPath) {
    return NextResponse.redirect(new URL('/auth/validate/email', request.url));
  }

  // Allow access to validation paths and APIs
  if (isValidationPath || isValidationApiPath) {
    return NextResponse.next();
  }

  // Check if user's profile is incomplete (including image)
  if (!session.user.profileCreated) {
    if (!isProfilePath) {
      return NextResponse.redirect(new URL(profilePath, request.url));
    }
    // Allow access to profile path
    return NextResponse.next();
  }

  // Check for fullyOnboarded status
  if (!session.user.fullyOnboarded) {
    if (!isOnboardingPath) {
      return NextResponse.redirect(new URL(onboardingPath, request.url));
    }
    // Allow access to onboarding path
    return NextResponse.next();
  }

  // Allow access to all other pages for authenticated and validated users
  return NextResponse.next();
}

function handleApiRoute(request: NextRequest, session: any) {
  // If there's no session, return 401 Unauthorized
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // If there is a session, allow the request to proceed
  return NextResponse.next();
}

// export const config = {
//   matcher: [
//     '/((?!api/auth|_next/static|favicon.ico).*)',
//     '/_next/image' // Add this line to include image routes in middleware
//   ]
// }

export const config = {
  matcher: ['/((?!api/auth|_next/static|favicon.ico).*)']
};
