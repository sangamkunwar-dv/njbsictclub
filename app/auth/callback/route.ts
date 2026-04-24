import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  // ❌ No code → redirect error
  if (!code) {
    return NextResponse.redirect(new URL('/auth/error', request.url))
  }

  // ✅ Correct cookie handling
  const cookieStore = cookies()

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
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            // ⚠️ Important: ignore errors in edge/runtime
            console.log('Cookie set error:', error)
          }
        },
      },
    }
  )

  // ✅ Exchange code for session
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('Auth error:', error)
    return NextResponse.redirect(new URL('/auth/error', request.url))
  }

  // ✅ SUCCESS → redirect
  return NextResponse.redirect(new URL('/dashboard', request.url))
}