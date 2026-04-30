import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cookieStore = await cookies()
    // This helper automatically looks for the Supabase auth cookies
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Use getUser() for security (it validates the token with Supabase)
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 500 })
  }
}