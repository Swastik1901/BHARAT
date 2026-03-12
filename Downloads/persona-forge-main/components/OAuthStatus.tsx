"use client"

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

interface OAuthConfig {
  google: boolean
  github: boolean
}

export default function OAuthStatus() {
  const [config, setConfig] = useState<OAuthConfig>({ google: false, github: false })

  useEffect(() => {
    // Check if OAuth providers are configured
    const checkConfig = async () => {
      try {
        const response = await fetch('/api/auth/providers')
        const providers = await response.json()
        
        setConfig({
          google: providers.some((p: any) => p.id === 'google'),
          github: providers.some((p: any) => p.id === 'github')
        })
      } catch (error) {
        console.error('Failed to check OAuth config:', error)
      }
    }

    checkConfig()
  }, [])

  return (
    <div className="p-4 bg-[#FFF4E2] border-[3px] border-black rounded-lg">
      <h3 className="font-black mb-3">OAuth Configuration Status</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {config.google ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <XCircle className="w-4 h-4 text-red-600" />
          )}
          <span className="text-sm font-bold">Google OAuth</span>
        </div>
        <div className="flex items-center gap-2">
          {config.github ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <XCircle className="w-4 h-4 text-red-600" />
          )}
          <span className="text-sm font-bold">GitHub OAuth</span>
        </div>
      </div>
      {(!config.google || !config.github) && (
        <p className="text-xs text-gray-600 mt-2">
          Check OAUTH_SETUP.md for configuration instructions
        </p>
      )}
    </div>
  )
}