//file auth.ts
import NextAuth, { User, CredentialsSignin } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';
import { validateEmail, validatePhone } from '@/lib/auth/validation';

import {
  findUserByEmail,
  createUser,
  upsertAccount,
  loginUser
} from '@/server/auth/user';
export class InvalidLoginError extends CredentialsSignin {
  code = 'invalid_credentials';
}

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials): Promise<any | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid email and password');
        }
        try {
          const user = await loginUser({
            email: credentials.email as string,
            password: credentials.password as string
          });

          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              emailVerified: user.emailVerified,
              phoneVerified: user.phoneVerified,
              phone: user.phone as string,
              apiUserToken: user.apiUserToken,
              profileCreated: user.profileCreated,
              fullyOnboarded: user.fullyOnboarded,
              business_info: user.business_info
            };
          }
        } catch (error: any) {
          throw new InvalidLoginError(
            error.message || 'Something wrong happened'
          );
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID!,
      clientSecret: process.env.APPLE_SECRET!
    })
  ],
  callbacks: {
    async signIn({ user, account, profile, email }) {
      if (account?.provider === 'credentials') {
        return true; // Handled by CredentialsProvider
      }

      if (account?.provider === 'google' || account?.provider === 'apple') {
        // const emailValidated = await validateEmail(user.email!)
        // if (!emailValidated) {
        //   return false // Prevent sign in if email is invalid
        // }

        // Check if user already exists
        let dbUser = await findUserByEmail(user.email!);
        // console.log(' user from google callback ==>', user.phone)
        if (!dbUser) {
          // Create new user if they don't exist
          try {
            dbUser = await createUser({
              name: user.name,
              email: user.email!,
              emailVerified: new Date(), // OAuth emails are typically pre-verified
              image: user.image,
              phone: '9999999999' // Initialize phone to empty string and then ask for phone verification
            });
            if (dbUser) {
              // Update the user object with the newly created database user
              // Add any other fields you want to pass to the jwt callback
              user.id = dbUser.id.toString();
              user.phone = dbUser.phone;
              user.phoneVerified = dbUser.phoneVerified;
              user.business_info = dbUser.business_info;
            }
          } catch (error) {
            console.error('Error creating user:', error);
            return false;
          }
        } else {
          // If user exists, update the user object with database info
          user.id = dbUser.id.toString();
          user.phone = dbUser.phone;
          user.phoneVerified = dbUser.phoneVerified;
          user.business_info = dbUser.business_info;
          // Add any other fields you want to pass to the jwt callback
        }

        // if (!dbUser.phone || !dbUser.phoneVerified) {
        //   // Redirect to phone verification page
        //   const verification_url = `/auth/verify-phone?userId=${dbUser.id}`
        //   return verification_url // `/auth/oauth-verify-phone?userId=${dbUser.id}`
        // }

        // Link account if it doesn't exist
        try {
          await upsertAccount({
            userId: dbUser?.id,
            type: account.type!,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            refresh_token: account.refresh_token,
            access_token: account.access_token,
            expires_at: account.expires_at,
            token_type: account.token_type,
            scope: account.scope,
            id_token: account.id_token
          });
        } catch (error) {
          console.error('Error linking account:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({
      token,
      user,
      trigger,
      session
    }: {
      token: JWT;
      user?: User;
      trigger?: string;
      session?: any;
    }) {
      if (user) {
        token.id = parseInt(user.id as string); // user.id as number
        token.email = user.email as string;
        token.name = user.name as string;
        token.emailVerified = user.emailVerified as Date;
        token.phoneVerified = user.phoneVerified as Date;
        token.image = user.image as string;
        token.phone = user.phone as string;
        token.apiUserToken = user.apiUserToken as string;
        token.fullyOnboarded = user.fullyOnboarded as boolean;
        token.profileCreated = user.profileCreated as boolean;
        token.business_info = user.business_info;
      }

      // update the token

      if (trigger === 'update') {
        console.log(' in trigger update');
        const updated_user = await findUserByEmail(token.email);
        token.id = updated_user?.id as number;
        token.email = updated_user?.email as string;
        token.name = updated_user?.name as string;
        token.emailVerified = updated_user?.emailVerified as Date;
        token.phoneVerified = updated_user?.phoneVerified as Date;
        token.image = updated_user?.image as string;
        token.phone = updated_user?.phone as string;
        token.fullyOnboarded = updated_user?.fullyOnboarded as boolean;
        token.profileCreated = updated_user?.profileCreated as boolean;
        token.business_info = updated_user?.business_info;
        // Always update the token with the latest session data
        return { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      // console.log(' in session 1', session?.phoneVerified, session?.emailVerified)

      if (session.user && token) {
        session.user.id = token.id;
        session.user.email = token.email as string;
        session.user.name = token.name;
        session.user.emailVerified = token.emailVerified;
        session.user.phoneVerified = token.phoneVerified;
        session.user.image = token.image;
        session.user.phone = token.phone;
        session.user.apiUserToken = token.apiUserToken;
        session.user.fullyOnboarded = token.fullyOnboarded;
        session.user.profileCreated = token.profileCreated;
        session.user.business_info = token.business_info;
      }
      // console.log(' in session before return ', session?.user?.phoneVerified, session?.user?.emailVerified)

      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    signOut: '/auth/signout'
  },
  events: {
    async createUser({ user }) {
      console.log('New user created:', user.email);
    },
    async linkAccount({ user, account, profile }) {
      console.log('Account linked for user:', user.email);
    }
  }
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// Custom sign-up route
export async function PUT(req: Request) {
  const { name, email, password, phone } = await req.json();

  // Validate email and phone
  const isEmailValid = await validateEmail(email);
  const isPhoneValid = await validatePhone(phone);

  if (!isEmailValid) {
    return new Response(JSON.stringify({ error: 'Invalid email' }), {
      status: 400
    });
  }

  if (!isPhoneValid) {
    return new Response(JSON.stringify({ error: 'Invalid phone number' }), {
      status: 400
    });
  }

  try {
    const user = await createUser({
      name,
      email,
      phone
    });

    return new Response(
      JSON.stringify({ message: 'User created successfully', userId: user.id }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return new Response(JSON.stringify({ error: 'Failed to create user' }), {
      status: 500
    });
  }
}
