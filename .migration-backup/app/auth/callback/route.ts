import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  // No code → redirect to login
  if (!code) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // This is a generic callback handler
  // Specific OAuth providers handle their own callbacks:
  // - /api/auth/callback/google → Google OAuth
  // - /api/auth/callback/github → GitHub OAuth
  
  // Redirect to dashboard if authenticated
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
