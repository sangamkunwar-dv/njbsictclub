import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET!

export async function GET() {
  const token = (await cookies()).get('token')?.value

  if (!token) {
    return NextResponse.json({}, { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return NextResponse.json(decoded)
  } catch {
    return NextResponse.json({}, { status: 401 })
  }
}