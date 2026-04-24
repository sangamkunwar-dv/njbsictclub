import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { generateQRCode } from '@/lib/qrcode'
import { generateUserID } from '@/lib/generate-user-id'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code) {
      return NextResponse.redirect(
        new URL('/auth/login?error=no_code', request.url)
      )
    }

    // Exchange code for token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
        grant_type: 'authorization_code',
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      console.error('Token exchange error:', tokenData)
      return NextResponse.redirect(
        new URL('/auth/login?error=token_exchange_failed', request.url)
      )
    }

    // Get user info
    const userResponse = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      }
    )

    const userData = await userResponse.json()

    await connectDB()

    // Find or create user
    let user = await User.findOne({ googleId: userData.id })

    if (!user) {
      // Generate unique user ID in format NJBS-XXXXXXXX
      let userId: string
      let userExists = true
      let attempts = 0
      while (userExists && attempts < 10) {
        userId = generateUserID()
        const existingID = await User.findOne({ userId })
        userExists = !!existingID
        attempts++
      }

      // Generate QR code (optional)
      let qrCode = ''
      try {
        const qrCodeData = `NJBS-${userData.email}-${userId}`
        qrCode = await generateQRCode(qrCodeData)
      } catch (qrError) {
        console.error('[v0] QR generation failed:', qrError)
        // Continue without QR code
      }

      user = new User({
        email: userData.email,
        full_name: userData.name,
        googleId: userData.id,
        avatar: userData.picture,
        oauthProvider: 'google',
        userId,
        qrCode,
        role: userData.email === 'sangamkunwar48@gmail.com' ? 'admin' : 'member',
      })

      await user.save()
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    )

    // Redirect based on role
    const redirectUrl = user.role === 'admin' ? '/admin' : '/dashboard'
    const response = NextResponse.redirect(
      new URL(redirectUrl, request.url)
    )
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (error) {
    console.error('OAuth error:', error)
    return NextResponse.redirect(
      new URL('/auth/login?error=oauth_failed', request.url)
    )
  }
}
