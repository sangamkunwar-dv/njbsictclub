import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Attendance from '@/models/Attendance'

export async function GET() {
  try {
    await connectDB()

    const records = await Attendance.find()
      .populate('userId', 'full_name email')
      .populate('eventId', 'title')
      .sort({ createdAt: -1 })

    return NextResponse.json(records)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()

    const body = await req.json()

    const record = await Attendance.create(body)

    return NextResponse.json(record)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
