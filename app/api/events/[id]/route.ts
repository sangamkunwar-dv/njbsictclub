import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Event } from '@/models/Event'

/**
 * GET single event (optional but useful)
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const event = await Event.findById(params.id)

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

/**
 * UPDATE event
 */
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const body = await req.json()

    const updated = await Event.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    )

    if (!updated) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

/**
 * DELETE event
 */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const deleted = await Event.findByIdAndDelete(params.id)

    if (!deleted) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}