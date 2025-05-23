import mongoose from 'mongoose';

// Schema for attachments in feedback
const feedbackAttachmentSchema = new mongoose.Schema({
  name: { type: String }, // Original file name
  url: { type: String, required: true } // Cloudinary URL or similar
});

const projectFeedbackSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }, // Link to the project
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to the user providing feedback
  rating: { type: Number, required: true, min: 1, max: 5 }, // Star rating (1 to 5)
  feedbackType: [{ type: String }], // Array of strings for feedback categories (e.g., "UI/UX", "Functionality")
  feedbackText: { type: String, required: true }, // The main feedback text
  attachments: [feedbackAttachmentSchema], // Array of attachment objects
  status: { type: String, default: 'pending', enum: ['pending', 'aproved', 'rejected'] }, // Status of the feedback
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

export default mongoose.model('ProjectFeedback', projectFeedbackSchema); 