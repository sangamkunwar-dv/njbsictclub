import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Team from '@/models/Team'
import { ObjectId } from 'mongodb'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const data = await req.json()

    const team = await Team.findByIdAndUpdate(params.id, data, { new: true })
    if (!team) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
    }

    return NextResponse.json(team)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const team = await Team.findByIdAndDelete(params.id)
    if (!team) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Team member deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 })
  }
}
