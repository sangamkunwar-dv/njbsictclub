import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { Event } from '@/models/Event'
import Project from '@/models/Project'
import Message from '@/models/Message'

export async function GET() {
  try {
    await connectDB()

    const totalMembers = await User.countDocuments()
    const totalEvents = await Event.countDocuments()
    const totalProjects = await Project.countDocuments()
    const totalMessages = await Message.countDocuments()

    return NextResponse.json({
      totalMembers,
      totalEvents,
      totalProjects,
      totalMessages,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
