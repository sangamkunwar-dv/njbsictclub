import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import { generateUserID } from '@/lib/generate-user-id'
import { generateQRCode } from '@/lib/qrcode'

export async function POST(req: Request) {
  try {
    await connectDB()

    const { email, password, fullName } = await req.json()

    // Validate inputs
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Generate unique user ID
    let userID: string
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
        { error: 'Failed to generate unique user ID' },
        { status: 500 }
      )
    }

    // Generate QR code with user ID and email
    const qrCodeData = `NJBS-${email}-${userID}`
    let qrCode: string
    try {
      qrCode = await generateQRCode(qrCodeData)
    } catch (qrError) {
      console.error('[v0] QR Code generation error:', qrError)
      // Continue without QR code if it fails
      qrCode = ''
    }

    const user = await User.create({
      email,
      password: hashedPassword,
      full_name: fullName,
      userId: userID,
      qrCode: qrCode,
      role: email === 'sangamkunwar48@gmail.com' ? 'admin' : 'member',
      oauthProvider: 'email',
    })

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error('[v0] Signup error:', error)
    return NextResponse.json(
      { error: error.message || 'Signup failed' },
      { status: 500 }
    )
  }
}
