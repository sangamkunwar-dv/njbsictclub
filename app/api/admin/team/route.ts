import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Team from '@/models/Team'

export async function GET() {
  try {
    await connectDB()
    const team = await Team.find().sort({ joinDate: -1 })
    return NextResponse.json(team)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const data = await req.json()

    const team = await Team.create(data)
    return NextResponse.json(team)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 })
  }
}
