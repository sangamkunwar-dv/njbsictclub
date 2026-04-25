import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

export async function GET() {
  try {
    // 1. Await the cookies() function
    const cookieStore = await cookies();
    
    // 2. Access the token
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: decoded,
    })
  } catch (error: any) {
    console.error("Auth API Error:", error);
    return NextResponse.json(
      { error: error?.message || 'Server error' },
      { status: 500 }
    )
  }
}