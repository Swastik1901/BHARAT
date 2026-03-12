import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    
    // For demonstration purposes, if API key is missing, we'll return a mock response
    // but the implementation is ready for Groq
    if (!apiKey) {
      console.warn('GROQ_API_KEY is missing. Returning mock response for Forge Engine.')
      
      // Simulate brief delay
      await new Promise(resolve => setTimeout(resolve, 3000))

      const mockResponses: Record<string, any> = {
        "startup": {
          "agentName": "Startup Mentor AI",
          "tone": "Friendly and supportive",
          "domain": "Startup advice",
          "memory": "session",
          "responseStyle": "Practical step-by-step guidance",
          "guardrails": [
            "No illegal advice",
            "Maintain professional tone",
            "Avoid harmful or unethical guidance"
          ],
          "systemPrompt": "You are a friendly startup mentor helping founders validate ideas and providing practical business advice. Your goal is to be supportive while offering realistic and actionable insights based on lean startup methodologies."
        },
        "default": {
          "agentName": "Custom AI Assistant",
          "tone": "Professional and helpful",
          "domain": "General Knowledge",
          "memory": "session",
          "responseStyle": "Clear and concise",
          "guardrails": [
            "Maintain accuracy",
            "Respect user privacy",
            "Avoid biased content"
          ],
          "systemPrompt": "You are a highly capable AI assistant designed to help users with their tasks. You maintain a professional tone and provide accurate information based on the user's requirements."
        }
      }

      const key = prompt.toLowerCase().includes("startup") ? "startup" : "default"
      return NextResponse.json(mockResponses[key])
    }

    const systemInstruction = `You are an AI system that converts descriptions of AI assistants into structured agent configurations.

Analyze the user description and generate a configuration with the following fields:
- agentName
- tone
- domain
- memory (stateless, session, or persistent)
- responseStyle
- guardrails (array of strings)
- systemPrompt

Return only valid JSON. Use this format:
{
  "agentName": "...",
  "tone": "...",
  "domain": "...",
  "memory": "...",
  "responseStyle": "...",
  "guardrails": [...],
  "systemPrompt": "..."
}

User description:
${prompt}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that generates structured JSON configurations for AI agents.' },
          { role: 'user', content: systemInstruction }
        ],
        response_format: { type: 'json_object' }
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ error: errorData.error?.message || 'Groq AI request failed' }, { status: response.status })
    }

    const data = await response.json()
    const content = data.choices[0].message.content
    
    try {
      const config = JSON.parse(content)
      return NextResponse.json(config)
    } catch (e) {
      return NextResponse.json({ error: 'Failed to parse Groq AI response' }, { status: 500 })
    }

  } catch (error: any) {
    console.error('Forge API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
