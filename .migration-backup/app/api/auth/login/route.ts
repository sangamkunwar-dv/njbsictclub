import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key'

// Demo account for testing without MongoDB
const DEMO_ACCOUNT = {
  email: 'demo@example.com',
  password: 'demo123',
  full_name: 'Demo User',
  role: 'member',
  userId: 'NJBS-DEMO001',
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    let user = null
    let dbConnected = true

    // Try to connect to database
    try {
      await connectDB()
      user = await User.findOne({ email })
    } catch (dbError: any) {
      console.warn('[v0] Database connection failed, using demo mode:', dbError.message)
      dbConnected = false
      
      // Allow demo account even without database
      if (email === DEMO_ACCOUNT.email) {
        user = {
          _id: 'demo-id',
          email: DEMO_ACCOUNT.email,
          password: DEMO_ACCOUNT.password,
          full_name: DEMO_ACCOUNT.full_name,
          role: DEMO_ACCOUNT.role,
          userId: DEMO_ACCOUNT.userId,
        }
      }
    }

    if (!user || !user.password) {
      return NextResponse.json(
        { 
          error: dbConnected 
            ? 'Invalid email or password' 
            : `Demo mode: use email: ${DEMO_ACCOUNT.email} password: ${DEMO_ACCOUNT.password}`
        },
        { status: 401 }
      )
    }

    // For demo account, skip bcrypt comparison
    let isMatch = false
    if (!dbConnected && email === DEMO_ACCOUNT.email) {
      isMatch = password === DEMO_ACCOUNT.password
    } else {
      isMatch = await bcrypt.compare(password, user.password)
    }

    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    const res = NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        userId: user.userId,
      },
    })

    res.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return res
  } catch (error: any) {
    console.error('[v0] Login error:', error.message)
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 500 }
    )
  }
}
