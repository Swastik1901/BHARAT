import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string | null
      plan: string
      isVerified: boolean
      agentsCreated: number
    }
  }

  interface User {
    id: string
    email: string
    name: string
    image?: string | null
    plan: string
    isVerified: boolean
    agentsCreated: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    plan: string
    isVerified: boolean
    agentsCreated: number
    userId: string
  }
}