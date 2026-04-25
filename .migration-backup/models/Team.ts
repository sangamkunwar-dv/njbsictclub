import mongoose from 'mongoose'

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  bio: { type: String },
  image_url: { type: String },
  social_links: {
    twitter: { type: String },
    linkedin: { type: String },
    github: { type: String },
  },
  skills: [{ type: String }],
  joinDate: { type: Date, default: Date.now },
}, { timestamps: true })

export default mongoose.models.Team || mongoose.model('Team', TeamSchema)
