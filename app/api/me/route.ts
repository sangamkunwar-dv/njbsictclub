import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

export async function GET() {
  try {
    // ✅ FIX: cookies() is async in Next.js 16
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'No token' },
        { status: 401 }
      )
    }

    // ✅ Verify token safely
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId: string }

    console.log("DECODED:", decoded)

    await connectDB()

    // ✅ Correct lookup
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
        id: user._id.toString(), // ✅ safer for frontend
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