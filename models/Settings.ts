import mongoose from 'mongoose'

const SettingsSchema = new mongoose.Schema(
  {
    clubName: { type: String, default: 'NJBSICT Club' },
    clubEmail: { type: String, default: 'club@njbsict.com' },
    clubDescription: { type: String, default: 'Welcome to our club!' },
    primaryColor: { type: String, default: '#6366f1' },
    secondaryColor: { type: String, default: '#8b5cf6' },
  },
  { timestamps: true }
)

export default mongoose.models.Settings ||
  mongoose.model('Settings', SettingsSchema)
