import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import { generateUserID } from '@/lib/generate-user-id'
import { generateQRCode } from '@/lib/qrcode'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key'

export async function POST(req: Request) {
  try {
    const { email, password, fullName } = await req.json()

    // Validate inputs
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    let dbConnected = true
    let user = null

    // Try to connect to database
    try {
      await connectDB()

      // Check if user exists
      const existing = await User.findOne({ email })
      if (existing) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 400 }
        )
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      // Generate unique user ID
      let userID: string = generateUserID()
      let userExists = true
      let attempts = 0
      while (userExists && attempts < 10) {
        userID = generateUserID()
        const existingID = await User.findOne({ userId: userID })
        userExists = !!existingID
        attempts++
      }

      if (userExists) {
        return NextResponse.json(
          { error: 'Failed to generate user ID, please try again' },
          { status: 500 }
        )
      }

      // Generate QR code
      let qrCode: string = ''
      try {
        const qrCodeData = `NJBS-${email}-${userID}`
        qrCode = await generateQRCode(qrCodeData)
      } catch (qrError) {
        console.warn('[v0] QR Code generation failed, continuing:', qrError)
      }

      user = await User.create({
        email,
        password: hashedPassword,
        full_name: fullName,
        userId: userID,
        qrCode: qrCode,
        role: email === 'sangamkunwar48@gmail.com' ? 'admin' : 'member',
        oauthProvider: 'email',
      })

    } catch (dbError: any) {
      console.warn('[v0] Database signup failed:', dbError.message)
      dbConnected = false

      // Demo mode - allow signup but show message
      const userID = generateUserID()
      user = {
        _id: 'demo-' + Date.now(),
        email,
        full_name: fullName,
        userId: userID,
        role: email === 'sangamkunwar48@gmail.com' ? 'admin' : 'member',
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Signup failed, please try again' },
        { status: 500 }
      )
    }

    // Create JWT token
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
      demo: !dbConnected,
    })

    res.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })

    return res
  } catch (error: any) {
    console.error('[v0] Signup error:', error.message)
    return NextResponse.json(
      { error: error.message || 'Signup failed' },
      { status: 500 }
    )
  }
}
