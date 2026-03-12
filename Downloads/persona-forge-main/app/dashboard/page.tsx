"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Sparkles,
  Bot,
  Rocket,
  TestTube,
  Settings,
  Search,
  Bell,
  Plus,
  Edit,
  Play,
  Menu,
  X,
  Clock,
  Activity,
  Zap,
  TrendingUp,
  LogOut
} from "lucide-react"
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

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeNav, setActiveNav] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  
  const { user, logout, loading } = useAuth()
  const router = useRouter()

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // Show loading while checking auth
  if (loading) {
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

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, href: "/dashboard" },
    { id: "create", label: "Create Agent", icon: <Sparkles className="w-5 h-5" />, href: "/create-agent" },
    { id: "deployments", label: "Deployments", icon: <Rocket className="w-5 h-5" />, href: "/deploy" },
    { id: "sandbox", label: "Sandbox Testing", icon: <TestTube className="w-5 h-5" />, href: "/sandbox" },
    { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" />, href: "/settings" },
  ]

  const agents = [
    {
      name: "Startup Mentor AI",
      description: "Helps founders validate ideas and build startups",
      memory: "Session",
      updated: "2 hours ago",
      color: "#5CC8FF"
    },
    {
      name: "Coding Tutor",
      description: "Teaches beginners programming concepts",
      memory: "Persistent",
      updated: "1 day ago",
      color: "#86EFAC"
    },
    {
      name: "Customer Support",
      description: "Handles customer inquiries and support tickets",
      memory: "Stateless",
      updated: "3 days ago",
      color: "#FF9AA2"
    },
    {
      name: "Content Writer",
      description: "Generates blog posts and marketing content",
      memory: "Session",
      updated: "5 days ago",
      color: "#C4B5FD"
    }
  ]

  const stats = [
    { label: "Active Agents", value: "4", icon: <Bot className="w-6 h-6" />, color: "#5CC8FF" },
    { label: "Total Deployments", value: "12", icon: <Rocket className="w-6 h-6" />, color: "#86EFAC" },
    { label: "API Calls Today", value: "1.2K", icon: <Zap className="w-6 h-6" />, color: "#FF9AA2" },
    { label: "Sandbox Tests", value: "28", icon: <TestTube className="w-6 h-6" />, color: "#C4B5FD" }
  ]

  const recentActivity = [
    { action: "Agent 'Startup Mentor' deployed to API", time: "2 hours ago", icon: <Rocket className="w-4 h-4" /> },
    { action: "Agent 'Coding Tutor' tested in sandbox", time: "5 hours ago", icon: <TestTube className="w-4 h-4" /> },
    { action: "Agent 'Customer Support AI' updated", time: "1 day ago", icon: <Edit className="w-4 h-4" /> },
    { action: "New agent 'Content Writer' created", time: "3 days ago", icon: <Sparkles className="w-4 h-4" /> }
  ]

  return (
    <div className="h-screen bg-[#FDF3B1] overflow-hidden flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#FFF4E2] border-r-[3px] border-black transition-transform duration-300 overflow-y-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-6">
          {/* Logo */}
          <a href="/" className="text-2xl font-black mb-8 block">
            PersonaForge
          </a>

          {/* Navigation */}
          <nav className="space-y-2 mb-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault()
                  setActiveNav(item.id)
                  setSidebarOpen(false)
                  router.push(item.href)
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all border-[3px]",
                  activeNav === item.id
                    ? "bg-[#FF7A00] text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-transparent text-black border-transparent hover:bg-[#FDF3B1]"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t-[3px] border-black bg-[#FFF4E2]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#FF7A00] border-[3px] border-black flex items-center justify-center font-black text-white">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm">{user.fullName}</div>
              <div className="text-xs text-gray-600">{user.email}</div>
              <div className="text-xs text-[#FF7A00] font-bold">{user.plan.toUpperCase()} Plan</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-[#FFF4E2] border-b-[3px] border-black p-4 flex items-center justify-between gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search agents..."
              className="pl-11"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF7A00] rounded-full"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-[#FF7A00] border-[3px] border-black flex items-center justify-center font-black text-white cursor-pointer">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="hover:translate-y-[-2px] transition-transform">
              <h1 className="text-4xl font-black mb-2">Welcome back, {user.fullName}!</h1>
              <p className="text-xl text-gray-600">Continue building and managing your AI agents.</p>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card 
                className="hover:translate-y-[-4px] transition-transform bg-[#5CC8FF] cursor-pointer"
                onClick={() => router.push('/create-agent')}
              >
                <Sparkles className="w-8 h-8 mb-3" />
                <h3 className="text-xl font-black mb-2">Create New Agent</h3>
                <p className="text-sm">Build a new AI agent from scratch</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card 
                className="hover:translate-y-[-4px] transition-transform bg-[#86EFAC] cursor-pointer"
                onClick={() => router.push('/sandbox')}
              >
                <TestTube className="w-8 h-8 mb-3" />
                <h3 className="text-xl font-black mb-2">Test Agent</h3>
                <p className="text-sm">Try your agents in sandbox</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card 
                className="hover:translate-y-[-4px] transition-transform bg-[#FF9AA2] cursor-pointer"
                onClick={() => router.push('/deploy')}
              >
                <Rocket className="w-8 h-8 mb-3" />
                <h3 className="text-xl font-black mb-2">Deploy Agent</h3>
                <p className="text-sm">Launch to production</p>
              </Card>
            </motion.div>
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="hover:translate-y-[-2px] transition-transform" style={{ backgroundColor: stat.color }}>
                  <div className="flex items-center justify-between mb-2">
                    {stat.icon}
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="text-3xl font-black mb-1">{stat.value}</div>
                  <div className="text-sm font-bold">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* My Agents Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black">My AI Agents</h2>
              <Button size="sm" onClick={() => router.push('/create-agent')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Agent
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {agents.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.description.toLowerCase().includes(searchQuery.toLowerCase())).map((agent, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <Card className="hover:translate-y-[-2px] transition-transform">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-black mb-2">{agent.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{agent.description}</p>
                      </div>
                      <div
                        className="w-3 h-3 rounded-full border-[3px] border-black"
                        style={{ backgroundColor: agent.color }}
                      ></div>
                    </div>

                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Activity className="w-4 h-4" />
                        <span className="font-bold">Memory:</span>
                        <span>{agent.memory}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{agent.updated}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => router.push('/create-agent')}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => router.push('/sandbox')}>
                        <Play className="w-4 h-4 mr-2" />
                        Test
                      </Button>
                      <Button size="sm" className="flex-1" onClick={() => router.push('/deploy')}>
                        <Rocket className="w-4 h-4 mr-2" />
                        Deploy
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-3xl font-black mb-6">Recent Activity</h2>
            <Card>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    className="flex items-center gap-3 pb-4 border-b-2 border-gray-200 last:border-0 last:pb-0"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FDF3B1] border-[2px] border-black flex items-center justify-center">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* Create New Agent CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
          >
            <Card className="bg-[#C4B5FD] text-center hover:translate-y-[-2px] transition-transform">
              <Sparkles className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-3xl font-black mb-4">Build Your Next AI Agent</h2>
              <p className="text-lg mb-6">Transform your ideas into intelligent AI assistants in minutes</p>
              <Button size="lg" onClick={() => router.push('/create-agent')}>
                <Plus className="w-5 h-5 mr-2" />
                Create Agent
              </Button>
            </Card>
          </motion.div>
        </main>
      </div>

      {/* Floating Create Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => router.push('/create-agent')}
        className="fixed bottom-8 right-8 bg-[#FF7A00] text-white px-6 py-4 rounded-xl font-black text-lg border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-200 flex items-center gap-2"
      >
        <Plus className="w-6 h-6" />
        Create Agent
      </motion.button>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}
    </div>
  )
}
