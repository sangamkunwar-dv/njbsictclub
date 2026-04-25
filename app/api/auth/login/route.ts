import { NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    const result = await authenticateUser(email, password)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      )
    }

    const res = NextResponse.json({
      user: result.user,
      success: true,
    })

    res.cookies.set('token', result.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none', // 🔴 IMPORTANT for cross-domain requests
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })

    return res
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 500 }
    )
  }
}