import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Message from '@/models/Message'

export async function POST(req: Request) {
  try {
    await connectDB()

    const { name, email, subject, message } = await req.json()

    // Validate inputs
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Create new message
    const newMessage = new Message({
      name,
      email,
      subject,
      message,
      status: 'new',
    })

    await newMessage.save()

    // TODO: Send email to admin
    console.log('[v0] New contact message:', { name, email, subject })

    return NextResponse.json(
      { success: true, message: 'Your message has been received' },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('[v0] Contact API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    await connectDB()

    // Get all messages
    const messages = await Message.find().sort({ createdAt: -1 })

    return NextResponse.json(messages)
  } catch (error: any) {
    console.error('[v0] Contact GET error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}
