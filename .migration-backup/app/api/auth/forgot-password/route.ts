import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import crypto from 'crypto'

// Store reset codes in memory (in production, use Redis or database)
const resetCodes = new Map<string, { code: string; expiresAt: number }>()

export async function POST(req: Request) {
  try {
    await connectDB()

    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const user = await User.findOne({ email })
    if (!user) {
      // Don't reveal if email exists (security best practice)
      return NextResponse.json({
        message: 'If an account exists with this email, a reset code will be sent',
      })
    }

    // Generate a 6-character alphanumeric code
    const resetCode = crypto.randomBytes(3).toString('hex').toUpperCase()
    const expiresAt = Date.now() + 15 * 60 * 1000 // 15 minutes

    // Store reset code
    resetCodes.set(email, { code: resetCode, expiresAt })

    // In production, send email here
    console.log(`Reset code for ${email}: ${resetCode}`)

    return NextResponse.json({
      message: 'Reset code sent to your email',
      // For testing only - remove in production
      testCode: resetCode,
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
