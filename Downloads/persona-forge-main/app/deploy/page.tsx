"use client"

import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  CheckCircle,
  Code,
  Globe,
  MessageSquare,
  Smartphone,
  Copy,
  ExternalLink,
  Shield,
  Zap,
  Database,
  Rocket,
  Check,
  Settings,
  ChevronRight
} from "lucide-react"

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

type DeploymentMethod = "api" | "widget" | "slack" | "whatsapp" | "discord" | null

export default function DeployPage() {
  const [selectedMethod, setSelectedMethod] = useState<DeploymentMethod>(null)
  const [isDeployed, setIsDeployed] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [copied, setCopied] = useState(false)
  const [deployAgentId, setDeployAgentId] = useState("")
  const [deployApiKey, setDeployApiKey] = useState("")
  const [config, setConfig] = useState({
    name: "Startup Mentor AI",
    tone: "Friendly & Supportive",
    expertise: "Startup Advice",
    description: "You are an AI startup mentor. Give advice on startups.",
    guardrails: ["stayOnTopic", "noHarmfulContent", "jailbreakResistance"]
  })

  React.useEffect(() => {
    const pendingConfig = localStorage.getItem('personaforge_pending_config')
    if (pendingConfig) {
      try {
        const parsed = JSON.parse(pendingConfig)
        setConfig(parsed)
      } catch (e) {
        console.error("Failed to parse pending config", e)
      }
    }
  }, [])

  const slug = config.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || "startup-mentor"
  const finalAgentId = deployAgentId || slug
  const agentUrl = `https://personaforge.ai/agent/${finalAgentId}`
  const apiEndpoint = `http://localhost:8000/v1/${finalAgentId}/chat`
  const finalApiKey = deployApiKey || "pf_live_a8f9d2c1b3e4567890abcdef"
  const widgetCode = `<script src="https://cdn.personaforge.ai/widget.js"></script>
<script>
PersonaForge.init({
  agentId: "${finalAgentId}",
  apiKey: "${finalApiKey}"
});
</script>`

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDeploy = async () => {
    setIsDeploying(true)
    try {
      const res = await fetch("http://localhost:8000/forge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      })
      const data = await res.json()
      if (data.agentId) {
        setDeployAgentId(data.agentId)
        if (data.apiKey) setDeployApiKey(data.apiKey)
      }
    } catch (e) {
      console.error("Failed to deploy agent to backend", e)
    } finally {
      setIsDeploying(false)
      setIsDeployed(true)
    }
  }

  const deploymentMethods = [
    {
      id: "api",
      title: "API Endpoint",
      description: "Generate a REST API endpoint for your AI agent",
      icon: <Code className="w-10 h-10" />,
      color: "#5CC8FF"
    },
    {
      id: "widget",
      title: "Website Widget",
      description: "Embed your AI agent as a chat widget on any website",
      icon: <Globe className="w-10 h-10" />,
      color: "#86EFAC"
    },
    {
      id: "slack",
      title: "Slack Bot",
      description: "Deploy your agent inside a Slack workspace",
      icon: <MessageSquare className="w-10 h-10" />,
      color: "#FF9AA2"
    },
    {
      id: "whatsapp",
      title: "WhatsApp Bot",
      description: "Enable conversations through WhatsApp",
      icon: <Smartphone className="w-10 h-10" />,
      color: "#C4B5FD"
    },
    {
      id: "discord",
      title: "Discord Bot",
      description: "Deploy the agent to a Discord server",
      icon: <MessageSquare className="w-10 h-10" />,
      color: "#FFD84D"
    }
  ]

  const stages = [
    { label: "Describe", completed: true },
    { label: "Forge", completed: true },
    { label: "Test", completed: true },
    { label: "Deploy", completed: isDeployed }
  ]

  return (
    <div className="min-h-screen bg-[#FDF3B1]">
      {/* Top Bar */}
      <header className="bg-[#FFF4E2] border-b-[3px] border-black p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </a>
            <h1 className="text-2xl font-black">Deploy Agent</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Top Section - Agent Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="hover:translate-y-[-2px] transition-transform">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-black mb-2">Agent Ready for Deployment</h2>
                <p className="text-lg text-gray-600">Your AI agent has been tested and is ready to go live</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="px-4 py-2 bg-[#86EFAC] border-[3px] border-black rounded-lg font-bold text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Tested in Sandbox
                </div>
                <div className="px-4 py-2 bg-[#5CC8FF] border-[3px] border-black rounded-lg font-bold text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Guardrails Verified
                </div>
              </div>
            </div>

            {/* Agent Info Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-[#5CC8FF] border-[3px] border-black rounded-lg">
                <div className="text-xs font-bold mb-1">AGENT NAME</div>
                <div className="text-lg font-black">{config.name}</div>
              </div>
              <div className="p-4 bg-[#86EFAC] border-[3px] border-black rounded-lg">
                <div className="text-xs font-bold mb-1">TONE</div>
                <div className="text-lg font-black">{config.tone}</div>
              </div>
              <div className="p-4 bg-[#FF9AA2] border-[3px] border-black rounded-lg">
                <div className="text-xs font-bold mb-1">MEMORY</div>
                <div className="text-lg font-black">Session-based</div>
              </div>
              <div className="p-4 bg-[#C4B5FD] border-[3px] border-black rounded-lg">
                <div className="text-xs font-bold mb-1">GUARDRAILS</div>
                <div className="text-lg font-black flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  {config.guardrails.length > 0 ? "Enabled" : "Disabled"}
                </div>
              </div>
            </div>

            {/* Pipeline Progress */}
            <div className="bg-[#FFD84D] p-6 rounded-lg border-[3px] border-black">
              <div className="text-sm font-black mb-4">DEPLOYMENT PIPELINE</div>
              <div className="flex items-center justify-between">
                {stages.map((stage, index) => (
                  <div key={index} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full border-[3px] border-black flex items-center justify-center font-black transition-all",
                          stage.completed ? "bg-[#86EFAC]" : "bg-[#FFF4E2]",
                          !stage.completed && index === stages.length - 1 && "ring-4 ring-[#FF7A00]/30"
                        )}
                      >
                        {stage.completed ? <Check className="w-6 h-6" /> : <Rocket className="w-6 h-6" />}
                      </div>
                      <div className="text-sm font-bold mt-2">{stage.label}</div>
                    </div>
                    {index < stages.length - 1 && (
                      <div
                        className={cn(
                          "w-16 lg:w-24 h-1 mx-2 border-[2px] border-black",
                          stages[index + 1].completed ? "bg-[#86EFAC]" : "bg-[#FFF4E2]"
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Middle Section - Deployment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-3xl font-black mb-6">Choose Deployment Method</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deploymentMethods.map((method, index) => (
              <motion.button
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                onClick={() => setSelectedMethod(method.id as DeploymentMethod)}
                className={cn(
                  "p-6 border-[3px] border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] transition-all text-left w-full",
                  selectedMethod === method.id ? "ring-4 ring-[#FF7A00]" : ""
                )}
                style={{ backgroundColor: method.color }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-[#FFF4E2] border-[3px] border-black rounded-lg">
                    {method.icon}
                  </div>
                  {selectedMethod === method.id && (
                    <CheckCircle className="w-8 h-8" />
                  )}
                </div>
                <h3 className="text-2xl font-black mb-2">{method.title}</h3>
                <p className="font-medium">{method.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Bottom Section - Configuration */}
        <AnimatePresence mode="wait">
          {selectedMethod && !isDeployed && (
            <motion.div
              key={selectedMethod}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <h3 className="text-2xl font-black mb-6">
                  {selectedMethod === "api" && "API Integration"}
                  {selectedMethod === "widget" && "Website Widget"}
                  {selectedMethod === "slack" && "Slack Integration"}
                  {selectedMethod === "whatsapp" && "WhatsApp Integration"}
                  {selectedMethod === "discord" && "Discord Integration"}
                </h3>

                {selectedMethod === "api" && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">API Endpoint</label>
                      <div className="flex gap-2">
                        <Input value={apiEndpoint} readOnly />
                        <Button variant="outline" onClick={() => handleCopy(apiEndpoint)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">API Key</label>
                      <div className="flex gap-2">
                        <Input value={finalApiKey} readOnly type="password" />
                        <Button variant="outline" onClick={() => handleCopy(finalApiKey)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="bg-[#FDF3B1] p-4 rounded-lg border-[3px] border-black">
                      <div className="text-sm font-bold mb-3">Example Request</div>
                      <pre className="text-xs font-mono overflow-x-auto">
{`POST ${apiEndpoint}
Content-Type: application/json

{
  "message": "Hello!",
  "session_id": "user-session-123"
}`}
                      </pre>
                    </div>
                  </div>
                )}

                {selectedMethod === "widget" && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">Embed Code</label>
                      <div className="bg-[#FDF3B1] p-4 rounded-lg border-[3px] border-black">
                        <pre className="text-xs font-mono whitespace-pre-wrap overflow-x-auto">
                          {widgetCode}
                        </pre>
                      </div>
                      <Button variant="outline" className="mt-3" onClick={() => handleCopy(widgetCode)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Embed Code
                      </Button>
                    </div>

                    <div className="bg-[#86EFAC] p-6 rounded-lg border-[3px] border-black">
                      <div className="text-sm font-bold mb-3">Widget Preview</div>
                      <div className="bg-[#FFF4E2] p-4 rounded-lg border-[3px] border-black">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-full bg-[#FF7A00] border-[2px] border-black"></div>
                          <div className="font-bold">{config.name}</div>
                        </div>
                        <div className="text-sm text-gray-600">Chat widget will appear here on your website</div>
                      </div>
                    </div>
                  </div>
                )}

                {(selectedMethod === "slack" || selectedMethod === "whatsapp" || selectedMethod === "discord") && (
                  <div className="space-y-4">
                    <p className="text-lg">
                      Connect your agent to {selectedMethod === "slack" ? "a Slack workspace" : selectedMethod === "whatsapp" ? "WhatsApp Business" : "a Discord server"}
                    </p>
                    <Button size="lg" className="w-full">
                      {selectedMethod === "slack" && <MessageSquare className="w-5 h-5 mr-2" />}
                      {selectedMethod === "whatsapp" && <Smartphone className="w-5 h-5 mr-2" />}
                      {selectedMethod === "discord" && <MessageSquare className="w-5 h-5 mr-2" />}
                      Connect {selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1)}
                    </Button>
                  </div>
                )}

                <div className="pt-6 border-t-[3px] border-black mt-6">
                  <Button size="lg" className="w-full" onClick={handleDeploy} disabled={isDeploying}>
                    <Rocket className="w-5 h-5 mr-2" />
                    {isDeploying ? "Deploying..." : "Deploy Agent"}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {isDeployed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="bg-[#86EFAC]">
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="w-20 h-20 bg-[#FFF4E2] rounded-full border-[3px] border-black flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle className="w-12 h-12 text-[#86EFAC]" />
                  </motion.div>

                  <h3 className="text-3xl font-black mb-3">Agent Successfully Deployed! </h3>
                  <p className="text-lg mb-8 font-medium">Your AI agent is now live and ready to use</p>

                  <div className="space-y-4 text-left max-w-2xl mx-auto">
                    <div>
                      <div className="text-sm font-bold mb-2">Live Agent URL</div>
                      <div className="flex gap-2">
                        <Input value={agentUrl} readOnly className="bg-[#FFF4E2]" />
                        <Button variant="outline" onClick={() => handleCopy(agentUrl)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                        <a href={agentUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </a>
                      </div>
                    </div>

                    {copied && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm font-bold text-center py-2 bg-[#FFF4E2] rounded-lg border-[2px] border-black"
                      >
                        Copied to clipboard!
                      </motion.div>
                    )}

                    <div className="grid grid-cols-2 gap-3 pt-4">
                      <Button variant="outline" className="w-full">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open Agent
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Settings className="w-4 h-4 mr-2" />
                        View Logs
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
