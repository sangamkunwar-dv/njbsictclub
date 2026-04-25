import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { getTokenFromRequest } from '@/lib/auth-middleware'
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

    const supabase = getSupabaseServer()

    const { data: user, error } = await supabase
      .from('users')
      .select('id, user_id, email, full_name, role, status')
      .eq('user_id', decoded.userId)
      .maybeSingle()

    if (error || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        userId: user.user_id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        status: user.status,
      },
      token: decoded,
    })
  } catch (error: any) {
    console.error('[auth me error]', error)

    return NextResponse.json(
      { error: error?.message || 'Failed to verify user' },
      { status: 500 }
    )
  }
}