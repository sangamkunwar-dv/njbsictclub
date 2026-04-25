import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['new', 'read', 'replied'],
      default: 'new',
    },
    adminReply: {
      type: String,
      default: null,
    },
    adminEmail: {
      type: String,
      default: process.env.ADMIN_EMAIL || 'admin@njbsictclub.com',
    },
    repliedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
)

export default mongoose.models.Message ||
  mongoose.model('Message', MessageSchema)
