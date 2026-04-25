import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ['active', 'completed', 'on-hold'],
      default: 'active',
    },
    startDate: Date,
    endDate: Date,
    technologies: String,
    githubUrl: String,
    demoUrl: String,
  },
  { timestamps: true }
)

export default mongoose.models.Project ||
  mongoose.model('Project', ProjectSchema)
