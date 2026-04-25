import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  full_name: { type: String },
  role: {
    type: String,
    enum: ['member', 'organizer', 'admin'],
    default: 'member',
  },
  // OAuth provider information
  oauthProvider: {
    type: String,
    enum: ['email', 'google', 'github'],
    default: 'email',
  },
  googleId: { type: String, unique: true, sparse: true },
  githubId: { type: String, unique: true, sparse: true },
  avatar: { type: String },
  
  // QR Code for attendance tracking
  qrCode: { type: String }, // Base64 encoded QR code image
  userId: { type: String, unique: true }, // Unique identifier for QR code content
}, { timestamps: true })

export default mongoose.models.User || mongoose.model('User', UserSchema)
