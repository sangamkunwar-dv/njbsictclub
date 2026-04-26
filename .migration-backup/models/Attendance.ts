import mongoose from 'mongoose'

const AttendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    checkInTime: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['present', 'absent', 'late'],
      default: 'present',
    },
  },
  { timestamps: true }
)

export default mongoose.models.Attendance ||
  mongoose.model('Attendance', AttendanceSchema)
