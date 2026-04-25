import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

export async function GET() {
  try {
    const token = cookies().get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'No token' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as any

    console.log("DECODED:", decoded)

    await connectDB()

    // ✅ FIX: use userId (NOT id)
    const user = await User.findOne({
      userId: decoded.userId
    })

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
        role: user.role,
      }
    })

  } catch (err) {
    console.error("JWT ERROR:", err)

    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }
}