"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Code,
  Zap,
  Shield,
  Rocket,
  Users,
  Check,
  MessageSquare,
  Star,
  ChevronRight,
  Play
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
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

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

// Textarea Component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full px-4 py-3 text-base border-[3px] border-black rounded-lg bg-white focus:outline-none focus:ring-4 focus:ring-[#FF7A00]/30 transition-all min-h-[120px]",
          className
        )}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

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

// Main Component
function PersonaForgeLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [agentPrompt, setAgentPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedConfig, setGeneratedConfig] = useState<any>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  const handleGenerate = () => {
    if (!agentPrompt.trim()) return

    setIsGenerating(true)
    setTimeout(() => {
      setGeneratedConfig({
        systemPrompt: "You are a friendly startup mentor AI that helps founders validate ideas and build successful companies.",
        tone: "Friendly & Supportive",
        domain: "Startup Advice",
        memory: "Session-based",
        guardrails: "Enabled",
        response: "Great question! To validate a startup idea, start by talking to potential customers..."
      })
      setIsGenerating(false)
    }, 2000)
  }

  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "PersonaForge Engine",
      description: "Transforms natural language into structured AI agent prompts instantly.",
      color: "#5CC8FF"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Guardrail Studio",
      description: "Configure safety rules and response constraints with ease.",
      color: "#FFD84D"
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Memory Layer",
      description: "Choose stateless, session, or persistent memory for your agent.",
      color: "#FF9AA2"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Sandbox Testing",
      description: "Test your agent in a safe environment before deployment.",
      color: "#C4B5FD"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Multi-Channel Deploy",
      description: "Deploy to API, widgets, Slack, or messaging apps instantly.",
      color: "#86EFAC"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Zero Coding Required",
      description: "Build powerful AI agents without writing a single line of code.",
      color: "#5CC8FF"
    }
  ]

  const steps = [
    {
      number: "01",
      title: "Describe",
      description: "Write what kind of AI agent you want using natural language.",
      color: "#5CC8FF"
    },
    {
      number: "02",
      title: "Forge",
      description: "PersonaForge converts your description into a structured agent configuration.",
      color: "#FFD84D"
    },
    {
      number: "03",
      title: "Test",
      description: "Chat with your agent in a sandbox environment.",
      color: "#FF9AA2"
    },
    {
      number: "04",
      title: "Deploy",
      description: "Deploy instantly as API, website widget, Slack bot, or messaging bot.",
      color: "#C4B5FD"
    }
  ]

  const testimonials = [
    {
      quote: "PersonaForge lets us prototype AI assistants in minutes instead of weeks.",
      author: "Sarah Chen",
      role: "CTO, TechStart",
      avatar: "SC"
    },
    {
      quote: "The guardrail system gives us confidence our AI stays on brand.",
      author: "Mike Johnson",
      role: "Product Lead, InnovateCo",
      avatar: "MJ"
    },
    {
      quote: "Finally, a no-code solution that actually works for complex AI agents.",
      author: "Lisa Park",
      role: "Founder, AgentLabs",
      avatar: "LP"
    }
  ]

  return (
    <div className="min-h-screen bg-[#FDF3B1] overflow-x-hidden relative">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#FFF4E2] border-b-[3px] border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <span className="text-2xl font-black">PersonaForge</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="font-bold hover:text-[#FF7A00] transition-colors">Features</a>
              <a href="#how-it-works" className="font-bold hover:text-[#FF7A00] transition-colors">How It Works</a>
              <a href="#demo" className="font-bold hover:text-[#FF7A00] transition-colors">Demo</a>
              <a href="#pricing" className="font-bold hover:text-[#FF7A00] transition-colors">Pricing</a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <a href="/login">
                <Button variant="outline" size="sm">Login</Button>
              </a>
              <Button size="sm">Start Building</Button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t-[3px] border-black bg-[#FFF4E2]"
            >
              <div className="px-4 py-6 space-y-4">
                <a href="#features" className="block font-bold py-2">Features</a>
                <a href="#how-it-works" className="block font-bold py-2">How It Works</a>
                <a href="#demo" className="block font-bold py-2">Demo</a>
                <a href="#pricing" className="block font-bold py-2">Pricing</a>
                <div className="pt-4 space-y-2">
                  <Button variant="outline" className="w-full">Login</Button>
                  <Button className="w-full">Start Building</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-6">
              Build AI Agents<br />
              <span className="text-[#FF7A00]">Without Writing Code</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-gray-700 max-w-3xl mx-auto">
              Describe your AI assistant in plain English. PersonaForge instantly generates the prompts, guardrails, memory configuration, and deployment pipeline.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Start Building Agent
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 border-y-[3px] border-black bg-[#FFF4E2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-lg font-bold mb-8">Built for Developers, Founders, and Teams</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {["Startup", "Developer", "Education", "Enterprise"].map((item) => (
              <div key={item} className="px-6 py-3 bg-[#FFF4E2] border-[3px] border-black rounded-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-black mb-4">
              From Idea to AI Agent in <span className="text-[#FF7A00]">Minutes</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:translate-y-[-4px] transition-transform" style={{ backgroundColor: step.color }}>
                  <div className="text-6xl font-black mb-4 opacity-50">{step.number}</div>
                  <h3 className="text-2xl font-black mb-3">{step.title}</h3>
                  <p className="text-lg">{step.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section id="demo" className="py-20 lg:py-32 bg-[#FFF4E2] border-y-[3px] border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-black mb-4">
              Build an AI Agent in <span className="text-[#FF7A00]">10 Seconds</span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <label className="block text-xl font-bold mb-4">Describe Your Agent</label>
              <Textarea
                value={agentPrompt}
                onChange={(e) => setAgentPrompt(e.target.value)}
                placeholder="Create a helpful AI coding tutor for beginners."
                className="mb-4"
              />
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !agentPrompt.trim()}
                className="w-full"
                size="lg"
              >
                {isGenerating ? "Generating..." : "Generate Agent"}
                <Sparkles className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <div>
              <AnimatePresence mode="wait">
                {generatedConfig ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Card className="mb-4 bg-[#5CC8FF]">
                      <h3 className="text-xl font-black mb-4">Generated Configuration</h3>
                      <div className="space-y-2">
                        <div><span className="font-bold">Tone:</span> {generatedConfig.tone}</div>
                        <div><span className="font-bold">Domain:</span> {generatedConfig.domain}</div>
                        <div><span className="font-bold">Memory:</span> {generatedConfig.memory}</div>
                        <div><span className="font-bold">Guardrails:</span> {generatedConfig.guardrails}</div>
                      </div>
                    </Card>
                    <Card className="bg-[#86EFAC] border-black">
                      <h3 className="text-xl font-black mb-4">Chat Preview</h3>
                      <div className="space-y-3">
                        <div className="bg-black/10 rounded-lg p-3">
                          <div className="text-xs font-bold mb-1">User:</div>
                          <div>"How do I validate a startup idea?"</div>
                        </div>
                        <div className="bg-black/20 rounded-lg p-3">
                          <div className="text-xs font-bold mb-1">AI:</div>
                          <div>{generatedConfig.response}</div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex items-center justify-center"
                  >
                    <Card className="text-center">
                      <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-xl font-bold text-gray-500">
                        Your generated agent will appear here
                      </p>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-black mb-4">
              Everything You Need to Build <span className="text-[#FF7A00]">AI Agents</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:translate-y-[-4px] transition-transform">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 border-[3px] border-black" style={{ backgroundColor: feature.color }}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-black mb-3">{feature.title}</h3>
                  <p className="text-lg text-gray-700">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-32 bg-[#FFF4E2] border-y-[3px] border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-black mb-4">
              Built for <span className="text-[#FF7A00]">Builders</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#FFD84D] text-[#FFD84D]" />
                    ))}
                  </div>
                  <p className="text-lg mb-6 font-medium">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#FF7A00] border-[3px] border-black flex items-center justify-center font-black text-white">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold">{testimonial.author}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-black mb-4">
              Simple <span className="text-[#FF7A00]">Pricing</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Starter", price: "$29", features: ["5 AI Agents", "Basic Guardrails", "Email Support"] },
              { name: "Pro", price: "$99", features: ["Unlimited Agents", "Advanced Guardrails", "Priority Support", "Custom Memory"], highlight: true },
              { name: "Enterprise", price: "Custom", features: ["Everything in Pro", "Dedicated Support", "Custom Integration", "SLA"] }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={cn("h-full", plan.highlight && "bg-[#FF7A00] text-[#0A0A0A] transform scale-105")}>
                  <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                  <div className="text-5xl font-black mb-6">{plan.price}<span className="text-xl">/mo</span></div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-5 h-5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className={cn("w-full", plan.highlight && "bg-[#FFF4E2] hover:bg-gray-50 text-[#0A0A0A]")}>
                    Get Started
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 lg:py-32 bg-[#FFF4E2] border-y-[3px] border-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-black mb-4">
              Frequently Asked <span className="text-[#FF7A00]">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: "Do I need coding knowledge to use PersonaForge?",
                a: "No! PersonaForge is designed for everyone. Just describe your agent in plain English and we'll handle the rest.",
                color: "#5CC8FF"
              },
              {
                q: "What can I deploy my AI agent to?",
                a: "You can deploy to REST APIs, website widgets, Slack bots, Discord, WhatsApp, and more messaging platforms.",
                color: "#86EFAC"
              },
              {
                q: "How do guardrails work?",
                a: "Guardrails are safety rules that ensure your AI agent stays on topic and responds appropriately. You can configure them with simple toggles.",
                color: "#FF9AA2"
              },
              {
                q: "Can I test my agent before deploying?",
                a: "Absolutely! Every agent includes a sandbox environment where you can chat and test behavior before going live.",
                color: "#C4B5FD"
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card style={{ backgroundColor: faq.color }} className="hover:translate-y-[-2px] transition-transform">
                  <h3 className="text-xl font-black mb-3">{faq.q}</h3>
                  <p className="text-lg">{faq.a}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof Section */}
      <section id="proof" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-black mb-4">
              Trusted by <span className="text-[#FF7A00]">Innovators</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { number: "10K+", label: "Agents Created", color: "#5CC8FF" },
              { number: "500+", label: "Active Teams", color: "#FFD84D" },
              { number: "1M+", label: "Conversations", color: "#FF9AA2" },
              { number: "99.9%", label: "Uptime", color: "#86EFAC" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card style={{ backgroundColor: stat.color }} className="text-center hover:translate-y-[-4px] transition-transform">
                  <div className="text-5xl font-black mb-2">{stat.number}</div>
                  <div className="text-lg font-bold">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 lg:py-32 bg-[#FFF4E2] border-y-[3px] border-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-black mb-4">
              Get in <span className="text-[#FF7A00]">Touch</span>
            </h2>
            <p className="text-xl text-gray-700">
              Have questions? Want a demo? Let's talk!
            </p>
          </motion.div>

          <Card className="bg-[#C4B5FD]">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Name</label>
                  <Input placeholder="Your name" className="bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Email</label>
                  <Input type="email" placeholder="you@company.com" className="bg-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Message</label>
                <Textarea placeholder="Tell us about your project..." className="bg-white" />
              </div>
              <Button size="lg" className="w-full">
                Send Message
                <MessageSquare className="ml-2 w-5 h-5" />
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-[#FF7A00] border-y-[3px] border-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-6xl font-black mb-6 text-white">
              Start Building Your AI Agent Today
            </h2>
            <p className="text-xl lg:text-2xl mb-8 font-bold text-white">
              No coding required. Just describe your agent.
            </p>
            <Button size="lg" variant="outline" className="bg-[#FFF4E2] hover:bg-gray-50">
              Start Building Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111111] text-white py-12 border-t-[3px] border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-black text-xl mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#FF7A00]">Features</a></li>
                <li><a href="#" className="hover:text-[#FF7A00]">Docs</a></li>
                <li><a href="#" className="hover:text-[#FF7A00]">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-black text-xl mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#FF7A00]">About</a></li>
                <li><a href="#" className="hover:text-[#FF7A00]">Blog</a></li>
                <li><a href="#" className="hover:text-[#FF7A00]">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-black text-xl mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#FF7A00]">Privacy</a></li>
                <li><a href="#" className="hover:text-[#FF7A00]">Terms</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-black text-xl mb-4">PersonaForge</h3>
              <p className="text-gray-400">Build AI agents without code.</p>
            </div>
          </div>
          <div className="border-t-[3px] border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PersonaForge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function Page() {
  return <PersonaForgeLanding />
}
