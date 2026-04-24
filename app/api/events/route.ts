import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Event } from '@/models/Event'

export async function GET() {
  try {
    await connectDB()

    const events = await Event.find().sort({ event_date: 1 })

    return NextResponse.json(events)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()

    const body = await req.json()

    const event = await Event.create(body)

    return NextResponse.json(event)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}