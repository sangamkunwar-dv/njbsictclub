import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key'

export async function GET() {
  try {
    // ✅ FIXED (removed await)
    const token = cookies().get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any

    await connectDB()
    const user = await User.findById(decoded.id)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        userId: user.userId,
        avatar: user.avatar,
        qrCode: user.qrCode,
      },
    })
  } catch (error: any) {
    console.error('[v0] Auth error:', error)
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
}