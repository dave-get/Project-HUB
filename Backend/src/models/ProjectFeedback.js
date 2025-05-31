import mongoose from 'mongoose';

// Schema for attachments in feedback
const feedbackAttachmentSchema = new mongoose.Schema({
  name: { type: String }, // Original file name
  url: { type: String, required: true },
  size: { type: String } // File size
});

const projectFeedbackSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }, // Link to the project
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to the teacher providing feedback
  collaboratorsId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of collaborator IDs
  rating: { type: Number, required: true, min: 1, max: 5 }, // Star rating (1 to 5)
  feedbackText: { type: String, required: true }, // The main feedback text
  attachments: [feedbackAttachmentSchema], // Array of attachment objects
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected','need review'] }, // Status of the feedback
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

export default mongoose.model('ProjectFeedback', projectFeedbackSchema); 