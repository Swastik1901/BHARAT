import mongoose, { Document, Schema } from 'mongoose'

export interface IAgent extends Document {
  userId: mongoose.Types.ObjectId
  name: string
  description: string
  systemPrompt: string
  tone: string
  domain: string
  responseStyle: string
  guardrails: string[]
  memoryMode: 'stateless' | 'session' | 'persistent'
  responseLength: 'short' | 'medium' | 'long'
  safetyFilters: boolean
  isDeployed: boolean
  deploymentUrl?: string
  createdAt: Date
  updatedAt: Date
  lastTested?: Date
  testCount: number
}

const AgentSchema = new Schema<IAgent>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Agent name is required'],
    trim: true,
    maxlength: [100, 'Agent name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Agent description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  systemPrompt: {
    type: String,
    required: true,
    maxlength: [2000, 'System prompt cannot exceed 2000 characters']
  },
  tone: {
    type: String,
    required: true,
    maxlength: [100, 'Tone cannot exceed 100 characters']
  },
  domain: {
    type: String,
    required: true,
    maxlength: [100, 'Domain cannot exceed 100 characters']
  },
  responseStyle: {
    type: String,
    required: true,
    maxlength: [100, 'Response style cannot exceed 100 characters']
  },
  guardrails: [{
    type: String,
    maxlength: [100, 'Each guardrail cannot exceed 100 characters']
  }],
  memoryMode: {
    type: String,
    enum: ['stateless', 'session', 'persistent'],
    default: 'session'
  },
  responseLength: {
    type: String,
    enum: ['short', 'medium', 'long'],
    default: 'medium'
  },
  safetyFilters: {
    type: Boolean,
    default: true
  },
  isDeployed: {
    type: Boolean,
    default: false
  },
  deploymentUrl: {
    type: String,
    trim: true
  },
  lastTested: {
    type: Date
  },
  testCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Indexes for faster queries
AgentSchema.index({ userId: 1 })
AgentSchema.index({ userId: 1, createdAt: -1 })

export default mongoose.models.Agent || mongoose.model<IAgent>('Agent', AgentSchema)