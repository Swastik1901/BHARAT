"use client"

import * as React from "react"
import { useState } from "react"
import { ArrowLeft, Save, User, Bell, Shield, Key, X, Check, Zap } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { motion, AnimatePresence } from "framer-motion"

function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(" ")
}

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

export default function SettingsPage() {
  const { user } = useAuth()
  
  // Profile State
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  
  // API Key State
  const [isKeyRevealed, setIsKeyRevealed] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [apiKey, setApiKey] = useState("pf_live_a8f9d2c1b3e4567890abcdef")
  
  // Subscription State
  const [localPlan, setLocalPlan] = useState(user?.plan || "free")
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  React.useEffect(() => {
    if (user?.plan) setLocalPlan(user.plan)
  }, [user])

  const handleSaveProfile = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 800)
  }

  const handleGenerateKey = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const newKey = "pf_live_" + Array(24).fill(0).map(() => Math.random().toString(36)[2]).join('')
      setApiKey(newKey)
      setIsKeyRevealed(true)
      setIsGenerating(false)
    }, 1000)
  }

  const handleUpgradePlan = (planName: string) => {
    setIsUpgrading(true)
    setTimeout(() => {
      setLocalPlan(planName)
      setIsUpgrading(false)
      setShowUpgradeModal(false)
    }, 1500)
  }

  const pricingTiers = [
    {
      name: "Starter",
      price: "Free",
      features: ["1 Active Agent", "1,000 API Calls/mo", "Basic Guardrails", "Community Support"],
      color: "#FFF4E2",
      buttonColor: "bg-white",
      value: "free"
    },
    {
      name: "Pro",
      price: "$29/mo",
      features: ["10 Active Agents", "50,000 API Calls/mo", "Advanced Guardrails", "Email Support", "Custom Branding"],
      color: "#5CC8FF",
      buttonColor: "bg-[#FF7A00] text-white",
      value: "pro",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: ["Unlimited Agents", "Unlimited API Calls", "Custom Guardrails", "24/7 Priority Support", "Dedicated Success Manager", "SLA Guarantee"],
      color: "#C4B5FD",
      buttonColor: "bg-white",
      value: "enterprise"
    }
  ]

  return (
    <div className="min-h-screen bg-[#FDF3B1] overflow-hidden flex flex-col">
      <header className="bg-[#FFF4E2] border-b-[3px] border-black p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </a>
          <h1 className="text-2xl font-black">Account Settings</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full space-y-8">
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6" />
            <h2 className="text-2xl font-black">Profile Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Full Name</label>
              <input 
                type="text" 
                defaultValue={user?.fullName || "Demo User"}
                className="w-full px-4 py-3 border-[3px] border-black rounded-lg bg-white"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Email Address</label>
              <input 
                type="email" 
                defaultValue={user?.email || "demo@example.com"}
                className="w-full px-4 py-3 border-[3px] border-black rounded-lg bg-white bg-gray-50 text-gray-500 cursor-not-allowed"
                readOnly
              />
            </div>
            <Button onClick={handleSaveProfile} disabled={isSaving}>
              {saved ? (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Saved Successfully!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Profile"}
                </>
              )}
            </Button>
          </div>
        </Card>

        <Card className="bg-[#5CC8FF]">
          <div className="flex items-center gap-3 mb-6">
            <Key className="w-6 h-6" />
            <h2 className="text-2xl font-black">API Keys</h2>
          </div>
          <p className="font-bold mb-4">Your secret keys for integrating PersonaForge agents.</p>
          <div className="bg-white p-4 border-[3px] border-black rounded-lg flex items-center justify-between">
            <code className="text-sm font-mono">
              {isKeyRevealed ? apiKey : "pf_live_" + "•".repeat(24)}
            </code>
            <Button variant="outline" size="sm" onClick={() => setIsKeyRevealed(!isKeyRevealed)}>
              {isKeyRevealed ? "Hide" : "Reveal"}
            </Button>
          </div>
          <Button className="mt-4" variant="outline" onClick={handleGenerateKey} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate New Key"}
          </Button>
        </Card>

        <Card className="bg-[#86EFAC]">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6" />
            <h2 className="text-2xl font-black">Subscription Plan</h2>
          </div>
          <p className="font-bold mb-2">Current Plan: <span className="uppercase text-[#FF7A00]">{localPlan}</span></p>
          <p className="mb-4">You are currently on the {localPlan} plan. Upgrade to unlock more agents and higher API limits.</p>
          <Button variant="outline" onClick={() => setShowUpgradeModal(true)}>
            View Upgrade Options
          </Button>
        </Card>
      </main>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUpgradeModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-[#FDF3B1] border-[4px] border-black rounded-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="bg-[#FFF4E2] border-b-[4px] border-black p-6 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#86EFAC] border-[3px] border-black flex items-center justify-center">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black">Upgrade Your Plan</h2>
                    <p className="font-bold text-gray-600">Scale your AI agents with PersonaForge</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-10 h-10 rounded-full border-[3px] border-black flex items-center justify-center hover:bg-[#FF9AA2] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body / Pricing Cards */}
              <div className="p-8 overflow-y-auto">
                <div className="grid md:grid-cols-3 gap-6">
                  {pricingTiers.map((tier) => (
                    <div 
                      key={tier.name}
                      style={{ backgroundColor: tier.color }}
                      className={cn(
                        "relative p-6 rounded-xl border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col hover:translate-y-[-4px] transition-transform",
                        tier.popular ? "ring-4 ring-[#FF7A00]" : ""
                      )}
                    >
                      {tier.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FF7A00] text-white font-black text-xs px-3 py-1 border-[2px] border-black rounded-full uppercase tracking-wider">
                          Most Popular
                        </div>
                      )}
                      
                      <div className="mb-6">
                        <h3 className="text-2xl font-black mb-2">{tier.name}</h3>
                        <div className="flex items-end gap-1">
                          <span className="text-4xl font-black">{tier.price}</span>
                          {tier.price !== "Free" && tier.price !== "Custom" && <span className="font-bold text-gray-700 mb-1">/mo</span>}
                        </div>
                      </div>

                      <ul className="space-y-3 mb-8 flex-1">
                        {tier.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 font-bold text-sm">
                            <Check className="w-5 h-5 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button 
                        className={cn("w-full border-[3px] border-black uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all", tier.buttonColor)}
                        onClick={() => handleUpgradePlan(tier.value)}
                        disabled={localPlan === tier.value || isUpgrading}
                      >
                        {localPlan === tier.value ? "Current Plan" : isUpgrading ? "Upgrading..." : "Select " + tier.name}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
