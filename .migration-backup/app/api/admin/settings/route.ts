import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Settings from '@/models/Settings'

export async function GET() {
  try {
    await connectDB()

    let settings = await Settings.findOne()

    if (!settings) {
      settings = await Settings.create({})
    }

    return NextResponse.json(settings)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB()

    const body = await req.json()

    let settings = await Settings.findOne()

    if (settings) {
      Object.assign(settings, body)
      await settings.save()
    } else {
      settings = await Settings.create(body)
    }

    return NextResponse.json(settings)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
