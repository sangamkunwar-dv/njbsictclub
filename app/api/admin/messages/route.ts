import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Message from '@/models/Message'

export async function GET(req: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    let query: any = {}
    if (status) {
      query.status = status
    }

    const messages = await Message.find(query).sort({ createdAt: -1 })

    return NextResponse.json(messages)
  } catch (error: any) {
    console.error('[v0] Admin messages GET error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()

    const body = await req.json()

    const message = await Message.create(body)

    return NextResponse.json(message, { status: 201 })
  } catch (error: any) {
    console.error('[v0] Admin messages POST error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create message' },
      { status: 500 }
    )
  }
}
