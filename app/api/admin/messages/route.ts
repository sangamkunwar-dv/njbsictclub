import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Message from '@/models/Message'

export async function GET() {
  try {
    await connectDB()

    const messages = await Message.find().sort({ createdAt: -1 })

    return NextResponse.json(messages)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()

    const body = await req.json()

    const message = await Message.create(body)

    return NextResponse.json(message)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
