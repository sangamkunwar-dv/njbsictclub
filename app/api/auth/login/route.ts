import { NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/auth'

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

    // Authenticate user
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
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })

    return res
  } catch (error: any) {
    console.error('[v0] Login error:', error)
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 500 }
    )
  }
}
