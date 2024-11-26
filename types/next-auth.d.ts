// file types/next-auth.d.ts
import NextAuth from 'next-auth';

declare module "next-auth" {
  interface Session {
    user: {
      id: number
      email: string
      name: string | null
      emailVerified: Date | null
      phoneVerified: Date | null
      image: string | null
      phone: string
      apiUserToken: string
      profileCreated: boolean | false
      fullyOnboarded: boolean | false
      business_info : any
    }
  }

  interface User {
    id: number
    email: string
    name: string | null
    emailVerified: Date | null
    phoneVerified: Date | null
    image: string | null
    phone: string
    apiUserToken: string
    profileCreated: boolean | false
    fullyOnboarded: boolean | false
    business_info : any
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number
    email: string
    name: string | null
    emailVerified: Date | null
    phoneVerified: Date | null
    image: string | null
    phone: string
    apiUserToken: string
    profileCreated: boolean | false
    fullyOnboarded: boolean | false
    business_info : any
  }
}