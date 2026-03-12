import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable inside .env.local')
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error('Invalid token')
  }
}

export interface JWTPayload {
  userId: string
  email: string
  fullName: string
  plan: string
}