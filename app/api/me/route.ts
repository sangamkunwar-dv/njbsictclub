import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

export async function GET() {
  try {
    const token = cookies().get('token')?.value

    console.log("TOKEN RECEIVED:", token)

    if (!token) {
      return NextResponse.json(
        { error: 'No token found' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!)

    console.log("DECODED JWT:", decoded)

    return NextResponse.json({
      ok: true,
      decoded
    })

  } catch (err) {
    console.error("JWT ERROR:", err)

    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }
}