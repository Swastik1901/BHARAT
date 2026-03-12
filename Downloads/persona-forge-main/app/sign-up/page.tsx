"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Mail, Lock, User, Github } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(" ")
}

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-bold rounded-lg transition-all duration-200 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
    
    const variants = {
      default: "bg-[#FF7A00] text-white hover:bg-[#E66D00]",
      outline: "bg-[#FFF4E2] text-black hover:bg-gray-50",
      ghost: "bg-transparent border-transparent shadow-none hover:bg-gray-100 hover:shadow-none"
    }
    
    const sizes = {
      default: "px-6 py-3 text-base",
      sm: "px-4 py-2 text-sm",
      lg: "px-8 py-4 text-lg"
    }
    
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full px-4 py-3 text-base border-[3px] border-black rounded-lg bg-white focus:outline-none focus:ring-4 focus:ring-[#FF7A00]/30 transition-all",
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

// Card Component
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-[#FFF4E2] border-[3px] border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6",
        className
      )}
      {...props}
    />
  )
)
Card.displayName = "Card"

export default function SignUpPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  const { signup, loginWithGoogle, loginWithGitHub, user } = useAuth()
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signup(fullName, email, password, confirmPassword)
      
      if (result.success) {
        router.push('/dashboard')
      } else {
        setError(result.error || 'Signup failed')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen bg-[#FDF3B1] overflow-hidden">
      <div className="grid lg:grid-cols-2 h-screen">
        {/* Left Side - Branding */}
        <div className="relative p-8 lg:p-16 flex flex-col justify-center items-end lg:pr-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left max-w-xl"
          >
            {/* Logo */}
            <div className="mb-8">
              <a href="/" className="text-5xl lg:text-6xl font-black hover:text-[#FF7A00] transition-colors">
                PersonaForge
              </a>
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-8">
              Start Building with <span className="text-[#FF7A00]">PersonaForge</span>
            </h1>
            <p className="text-2xl lg:text-3xl text-gray-700">
              Create and deploy AI agents in minutes.
            </p>
          </motion.div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="relative p-8 lg:p-16 flex items-center justify-center bg-[#FFF4E2] lg:bg-transparent">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <Card className="hover:translate-y-[-2px] transition-transform">
              {/* Form Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-black mb-2">Create Your Account</h2>
                <p className="text-gray-600">Join PersonaForge and start building.</p>
              </div>

              {/* Sign Up Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-100 border-[3px] border-red-500 rounded-lg">
                    <p className="text-red-700 font-bold text-sm">{error}</p>
                  </div>
                )}

                {/* Full Name Input */}
                <div>
                  <label className="block text-sm font-bold mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-11"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-bold mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-bold mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11"
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-sm font-bold mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-11"
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                  </div>
                </div>

                {/* Sign Up Button */}
                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                  {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-[3px] border-black"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-[#FFF4E2] font-bold">or sign up with</span>
                  </div>
                </div>

                {/* Social Sign Up */}
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={loginWithGoogle}
                    disabled={isLoading}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={loginWithGitHub}
                    disabled={isLoading}
                  >
                    <Github className="w-5 h-5 mr-2" />
                    GitHub
                  </Button>
                </div>

                {/* Login Link */}
                <div className="text-center pt-4">
                  <p className="text-sm">
                    Already have an account?{" "}
                    <a href="/login" className="font-bold text-[#FF7A00] hover:underline">
                      Login
                    </a>
                  </p>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
