import mongoose from 'mongoose'

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    event_date: { type: Date, required: true },
    location: String,
    capacity: Number,
    event_type: String,
    image_url: String,
  },
  { timestamps: true }
)

export const Event =
  mongoose.models.Event || mongoose.model('Event', EventSchema)