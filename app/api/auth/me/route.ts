import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getTokenFromRequest } from '@/lib/auth-middleware'
import { getSupabaseServer } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req)

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

    // Fetch fresh user data from database
    const supabase = getSupabaseServer()
    const { data: user, error } = await supabase
      .from('users')
      .select('id, user_id, email, full_name, role, status')
      .eq('user_id', decoded.userId)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...user,
      token: decoded,
    })
  } catch (error: any) {
    console.error('[v0] Auth me error:', error)
    return NextResponse.json(
      { error: 'Failed to verify user' },
      { status: 500 }
    )
  }
}
