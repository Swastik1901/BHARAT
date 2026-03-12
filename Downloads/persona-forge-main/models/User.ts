import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  fullName: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
  isVerified: boolean
  plan: 'starter' | 'pro' | 'enterprise'
  agentsCreated: number
  lastLogin?: Date
}

const UserSchema = new Schema<IUser>({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  plan: {
    type: String,
    enum: ['starter', 'pro', 'enterprise'],
    default: 'starter'
  },
  agentsCreated: {
    type: Number,
    default: 0
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
})

// Index for faster queries
UserSchema.index({ email: 1 })

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)