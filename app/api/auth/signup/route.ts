import { NextResponse } from 'next/server'
import { createUser, createToken } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { email, password, fullName } = await req.json()

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const result = await createUser(email, password, fullName)

    if (!result.success || !result.user) {
      return NextResponse.json(
        { error: result.error || 'User creation failed' },
        { status: 400 }
      )
    }

    // ✅ SAFE access (FIX)
    const token = createToken(result.user.userId, email, 'member')

    const res = NextResponse.json({
      user: {
        id: result.user.id,
        email: result.user.email,
        fullName: result.user.fullName,
        userId: result.user.userId,
        role: 'member',
      },
      success: true,
    })

    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })

    return res
  } catch (error: any) {
    console.error('[signup error]', error)

    return NextResponse.json(
      { error: error?.message || 'Signup failed' },
      { status: 500 }
    )
  }
}