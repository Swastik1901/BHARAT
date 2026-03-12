"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useSession, signIn, signOut, SessionProvider } from 'next-auth/react'

interface User {
  id: string
  fullName: string
  email: string
  plan: string
  isVerified: boolean
  agentsCreated?: number 
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  loginWithGoogle: () => Promise<void>
  loginWithGitHub: () => Promise<void>
  signup: (fullName: string, email: string, password: string, confirmPassword: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function AuthProviderInner({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const loading = status === "loading"

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id,
        fullName: session.user.name,
        email: session.user.email,
        plan: session.user.plan,
        isVerified: session.user.isVerified,
        agentsCreated: session.user.agentsCreated
      })
    } else {
      setUser(null)
    }
  }, [session])

  useEffect(() => {
    // Check for stored auth data on mount (for custom auth)
    if (!session) {
      const storedToken = localStorage.getItem('auth-token')
      const storedUser = localStorage.getItem('auth-user')

      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    }
  }, [session])

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.ok) {
        return { success: true }
      } else {
        return { success: false, error: result?.error || 'Invalid credentials' }
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const loginWithGoogle = async () => {
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  const loginWithGitHub = async () => {
    await signIn('github', { callbackUrl: '/dashboard' })
  }

  const signup = async (fullName: string, email: string, password: string, confirmPassword: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password, confirmPassword }),
      })

      const data = await response.json()

      if (response.ok) {
        // After successful signup, sign in with NextAuth
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false
        })

        if (result?.ok) {
          return { success: true }
        } else {
          return { success: false, error: 'Account created but login failed' }
        }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const logout = () => {
    if (session) {
      signOut({ callbackUrl: '/login' })
    } else {
      // Custom auth logout
      setUser(null)
      setToken(null)
      localStorage.removeItem('auth-token')
      localStorage.removeItem('auth-user')
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
      window.location.href = '/login'
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      loginWithGoogle, 
      loginWithGitHub, 
      signup, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderInner>{children}</AuthProviderInner>
    </SessionProvider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}