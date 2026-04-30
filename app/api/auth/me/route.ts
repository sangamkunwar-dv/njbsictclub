import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = await cookies()

  // 1. Initialize the Supabase client correctly for SSR
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // This is expected during a GET request in Next.js
          }
        },
      },
    }
  )

  try {
    // 2. Use getUser() instead of manual token verification
    // This automatically checks the cookies and validates the session
    const { data: { user }, error } = await supabase.auth.getUser()

    // 3. SILENT FAIL: If no user is found, return 200 with user: null
    // This stops the red "401 Unauthorized" error in your console
    if (error || !user) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    // 4. Return the user data to your Navbar
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        // Add any other user metadata you need here
        full_name: user.user_metadata?.full_name,
        avatar_url: user.user_metadata?.avatar_url,
      },
    })
  } catch (err: any) {
    console.error("Auth API Error:", err)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}