import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { hashPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { fullName, email, password, confirmPassword } = await request.json()

    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword
    })

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      plan: user.plan
    })

    // Return success response
    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        plan: user.plan,
        isVerified: user.isVerified
      },
      token
    }, { status: 201 })

  } catch (error: any) {
    console.error('Signup error:', error)
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}