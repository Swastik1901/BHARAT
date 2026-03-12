"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Sparkles, TestTube, Save, Rocket, Database, Shield, MessageSquare } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

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
      <button ref={ref} className={cn(baseStyles, variants[variant], sizes[size], className)} {...props} />
    )
  }
)
Button.displayName = "Button"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("bg-[#FFF4E2] border-[3px] border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6", className)} {...props} />
  )
)
Card.displayName = "Card"

interface AgentConfig {
  agentName: string
  systemPrompt: string
  tone: string
  domain: string
  responseStyle: string
  guardrails: string[]
  memory: string
}

const FORGE_STEPS = [
  "Analyzing description",
  "Generating system prompt",
  "Configuring guardrails",
  "Setting memory mode"
]

export default function CreateAgentPage() {
  const [description, setDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [agentConfig, setAgentConfig] = useState<AgentConfig | null>(null)
  const [memoryMode, setMemoryMode] = useState("session")
  const [responseLength, setResponseLength] = useState("medium")
  const [safetyFilters, setSafetyFilters] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState("")
  
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()

  // Progressive loading effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isGenerating) {
      setCurrentStep(0)
      interval = setInterval(() => {
        setCurrentStep((prev) => (prev < FORGE_STEPS.length - 1 ? prev + 1 : prev))
      }, 800)
    }
    return () => clearInterval(interval)
  }, [isGenerating])

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="h-screen bg-[#FDF3B1] flex items-center justify-center">
        <div className="text-2xl font-black">Loading...</div>
      </div>
    )
  }

  // Don't render if no user
  if (!user) {
    return null
  }

  const handleForgeAgent = async () => {
    if (!description.trim()) return
    setIsGenerating(true)
    setSaveError("")
    
    try {
      const response = await fetch('/api/forge-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: description }),
      })

      const data = await response.json()

      if (response.ok) {
        setAgentConfig(data)
        if (data.memory) {
          setMemoryMode(data.memory)
        }
      } else {
        setSaveError(data.error || 'Failed to generate agent configuration. Please try again.')
      }
    } catch (error) {
      setSaveError('Failed to generate agent configuration. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveAgent = async () => {
    if (!agentConfig || !token) return
    
    setIsSaving(true)
    setSaveError("")
    
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: agentConfig.agentName || agentConfig.domain + " Agent",
          description: description,
          systemPrompt: agentConfig.systemPrompt,
          tone: agentConfig.tone,
          domain: agentConfig.domain,
          responseStyle: agentConfig.responseStyle,
          guardrails: agentConfig.guardrails,
          memoryMode,
          responseLength,
          safetyFilters
        })
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/dashboard')
      } else {
        setSaveError(data.error || 'Failed to save agent')
      }
    } catch (error) {
      setSaveError('Network error. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleNavigateWithConfig = (path: string) => {
    if (agentConfig) {
      localStorage.setItem('personaforge_pending_config', JSON.stringify({
        name: agentConfig.agentName || agentConfig.domain + " Agent",
        tone: agentConfig.tone,
        expertise: agentConfig.domain,
        description: agentConfig.systemPrompt,
        guardrails: safetyFilters ? agentConfig.guardrails : []
      }))
    }
    router.push(path)
  }

  return (
    <div className="min-h-screen bg-[#FDF3B1]">
      <header className="bg-[#FFF4E2] border-b-[3px] border-black p-4 sticky top-0 z-10">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </a>
            <h1 className="text-2xl font-black">Create AI Agent</h1>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FF7A00]" />
            <span className="font-black">PersonaForge Studio</span>
          </div>
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto p-6">
        <div className="grid lg:grid-cols-[400px_1fr_350px] gap-6">
          <div className="space-y-6">
            <Card>
              <h2 className="text-2xl font-black mb-2">Describe Your AI Agent</h2>
              <p className="text-sm text-gray-600 mb-4">Use natural language to describe what kind of AI agent you want to create.</p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Example: Create a friendly AI startup mentor that helps founders validate ideas and provides practical business advice."
                className="w-full h-48 px-4 py-3 text-base border-[3px] border-black rounded-lg bg-white focus:outline-none focus:ring-4 focus:ring-[#FF7A00]/30 transition-all resize-none font-medium"
              />
              <Button size="lg" className="w-full mt-4" onClick={handleForgeAgent} disabled={!description.trim() || isGenerating}>
                <Sparkles className="w-5 h-5 mr-2" />
                {isGenerating ? "Forging..." : "Forge Agent"}
              </Button>
            </Card>
            <div>
              <h3 className="text-lg font-black mb-3">Suggested Prompts</h3>
              <div className="space-y-3">
                {[
                  { title: "Startup Mentor AI", description: "Create a friendly AI startup mentor that helps founders validate ideas and provides practical business advice.", color: "#5CC8FF" },
                  { title: "Customer Support AI", description: "Build an AI agent that handles customer inquiries professionally and resolves common support tickets.", color: "#86EFAC" },
                  { title: "Python Tutor", description: "Design an AI coding tutor that teaches Python programming concepts with clear examples and exercises.", color: "#FF9AA2" },
                  { title: "Resume Reviewer", description: "Create an AI that reviews resumes and provides constructive feedback on formatting, content, and impact.", color: "#C4B5FD" }
                ].map((prompt, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setDescription(prompt.description)}
                    className="w-full p-4 border-[3px] border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all text-left"
                    style={{ backgroundColor: prompt.color }}
                  >
                    <div className="font-black mb-1">{prompt.title}</div>
                    <div className="text-sm">{prompt.description}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="bg-[#FFE8B1] min-h-[600px]">
              <h2 className="text-2xl font-black mb-6">Generated Agent Configuration</h2>
              <AnimatePresence mode="wait">
                {!agentConfig && !isGenerating && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-[500px] text-center">
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="mb-6">
                      <Sparkles className="w-20 h-20 text-gray-400" />
                    </motion.div>
                    <h3 className="text-2xl font-black mb-2 text-gray-700">No Agent Yet</h3>
                    <p className="text-gray-600">Describe your agent and click "Forge Agent" to get started</p>
                  </motion.div>
                )}
                {isGenerating && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-[500px]">
                    <div className="relative mb-12">
                      <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }} 
                      >
                        <Sparkles className="w-24 h-24 text-[#FF7A00]" />
                      </motion.div>
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="w-12 h-12 bg-[#FF7A00]/20 rounded-full blur-xl" />
                      </motion.div>
                    </div>
                    <h3 className="text-3xl font-black mb-6">Forging your AI agent...</h3>
                    <div className="w-full max-w-sm space-y-4">
                      {FORGE_STEPS.map((step, idx) => (
                        <div key={step} className="flex items-center gap-3">
                          <div className={cn(
                            "w-6 h-6 rounded-full border-2 border-black flex items-center justify-center transition-colors duration-300",
                            idx < currentStep ? "bg-[#86EFAC]" : idx === currentStep ? "bg-[#FF7A00] animate-pulse" : "bg-white"
                          )}>
                            {idx < currentStep && <div className="w-2 h-2 bg-black rounded-full" />}
                          </div>
                          <span className={cn(
                            "font-bold transition-opacity duration-300",
                            idx <= currentStep ? "opacity-100" : "opacity-30"
                          )}>
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                {agentConfig && !isGenerating && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-[#FF7A00] border-[3px] border-black rounded-lg col-span-2 text-white">
                        <div className="text-xs font-bold mb-1 opacity-80 uppercase">Agent Name</div>
                        <div className="text-2xl font-black">{agentConfig.agentName}</div>
                      </div>
                      <div className="p-4 bg-[#5CC8FF] border-[3px] border-black rounded-lg">
                        <div className="text-xs font-bold mb-1 opacity-80 uppercase">Tone / Personality</div>
                        <div className="font-black">{agentConfig.tone}</div>
                      </div>
                      <div className="p-4 bg-[#86EFAC] border-[3px] border-black rounded-lg">
                        <div className="text-xs font-bold mb-1 opacity-80 uppercase">Domain Expertise</div>
                        <div className="font-black">{agentConfig.domain}</div>
                      </div>
                      <div className="p-4 bg-[#FF9AA2] border-[3px] border-black rounded-lg col-span-2">
                        <div className="text-xs font-bold mb-1 opacity-80 uppercase">Response Style</div>
                        <div className="font-black">{agentConfig.responseStyle}</div>
                      </div>
                    </div>
                    <div className="p-4 bg-[#C4B5FD] border-[3px] border-black rounded-lg">
                      <div className="text-xs font-bold mb-2 opacity-80 uppercase">Guardrails</div>
                      <div className="flex flex-wrap gap-2">
                        {agentConfig.guardrails.map((guardrail, index) => (
                          <span key={index} className="px-3 py-1 bg-white border-[2px] border-black rounded-lg text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{guardrail}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-black mb-3">System Prompt</h3>
                      <div className="bg-[#FFF4E2] border-[3px] border-black rounded-lg p-4 max-h-48 overflow-y-auto shadow-inner">
                        <pre className="text-sm font-mono whitespace-pre-wrap">{agentConfig.systemPrompt}</pre>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-black mb-4">Agent Settings</h2>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="w-4 h-4" />
                  <h3 className="text-sm font-black">Memory Mode</h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {["stateless", "session", "persistent"].map((mode) => (
                    <button 
                      key={mode} 
                      onClick={() => setMemoryMode(mode)} 
                      className={cn(
                        "w-full p-2.5 border-[3px] border-black rounded-lg font-bold text-left transition-all", 
                        memoryMode === mode 
                          ? "bg-[#FF7A00] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" 
                          : "bg-[#FFF4E2] hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      )}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4" />
                  <h3 className="text-sm font-black">Response Length</h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["short", "medium", "long"].map((length) => (
                    <button 
                      key={length} 
                      onClick={() => setResponseLength(length)} 
                      className={cn(
                        "p-2 border-[3px] border-black rounded-lg font-bold text-center text-xs transition-all", 
                        responseLength === length 
                          ? "bg-[#FF7A00] text-white" 
                          : "bg-[#FFF4E2] hover:bg-white"
                      )}
                    >
                      {length.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4" />
                  <h3 className="text-sm font-black">Guardrails</h3>
                </div>
                <button onClick={() => setSafetyFilters(!safetyFilters)} className={cn("w-full p-3 border-[3px] border-black rounded-lg font-bold flex items-center justify-between transition-all", safetyFilters ? "bg-[#86EFAC]" : "bg-[#FFF4E2]")}>
                  <span className="text-sm text-black">Safety Filters</span>
                  <div className={cn("w-10 h-5 rounded-full border-[2px] border-black relative transition-all", safetyFilters ? "bg-[#FF7A00]" : "bg-gray-300")}>
                    <div className={cn("absolute top-0.5 w-3 h-3 bg-white border-[2px] border-black rounded-full transition-all", safetyFilters ? "right-0.5" : "left-0.5")} />
                  </div>
                </button>
              </div>
            </Card>
            <Card className="bg-[#5CC8FF]">
              <h3 className="text-lg font-black mb-4">Actions</h3>
              
              {saveError && (
                <div className="p-3 bg-white border-[3px] border-red-500 rounded-lg mb-4 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]">
                  <p className="text-red-600 font-bold text-xs">{saveError}</p>
                </div>
              )}
              
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full bg-white" 
                  disabled={!agentConfig}
                  onClick={() => handleNavigateWithConfig('/sandbox')}
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  Test in Sandbox
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full bg-white" 
                  disabled={!agentConfig || isSaving}
                  onClick={handleSaveAgent}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Agent"}
                </Button>
                <Button 
                  className="w-full bg-[#FF7A00]" 
                  disabled={!agentConfig}
                  onClick={() => handleNavigateWithConfig('/deploy')}
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Deploy Agent
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

