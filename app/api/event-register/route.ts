import { connectDB } from '@/lib/mongodb'
import mongoose from 'mongoose'

const RegSchema = new mongoose.Schema({
  eventId: String,
  userId: String,
})

const Reg =
  mongoose.models.Reg || mongoose.model('Reg', RegSchema)

export async function POST(req: Request) {
  await connectDB()

  const body = await req.json()

  await Reg.create(body)

  return Response.json({ success: true })
}