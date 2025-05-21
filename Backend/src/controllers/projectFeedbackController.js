import ProjectFeedback from '../models/ProjectFeedback.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import Project from '../models/Project.js'; // Import the Project model

// Configure Multer for memory storage for feedback attachments
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to handle multiple file uploads for feedback attachments
export const uploadFeedbackAttachments = upload.array('attachments', 10); // 'attachments' is the field name, max 10 files

// Helper function to upload files to Cloudinary (can reuse the one from projectController or define a new one if needed)
// Assuming uploadToCloudinary function is available (you might need to import it or define it here)
const uploadToCloudinary = async (file, options = {}) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    }).end(file.buffer);
  });
};

// Create new project feedback
export const createProjectFeedback = async (req, res) => {
  try {
    const { projectId, userId, rating, feedbackType, feedbackText } = req.body; // Get text fields from body
    const files = req.files; // Get uploaded files from Multer


    // Upload attachments to Cloudinary
    const attachmentUploadPromises = files ? files.map(file =>
      uploadToCloudinary(file, { folder: 'feedback_attachments' }).then(result => ({
        name: file.originalname,
        url: result.secure_url,
      }))
    ) : [];

    const uploadedAttachments = await Promise.all(attachmentUploadPromises);

    // Create new feedback document
    const newFeedback = new ProjectFeedback({
      projectId,
      userId,
      rating,
      feedbackType: Array.isArray(feedbackType) ? feedbackType : [feedbackType].filter(Boolean), // Handle single or multiple types
      feedbackText,
      attachments: uploadedAttachments,
      status: 'Addressed', // Set status to Addressed upon creation as requested
    });

    const savedFeedback = await newFeedback.save();

    // After saving feedback, find the related project and update its status
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { status: true, reviewedByTeacherId: userId }, // Set status to true (Addressed) and assign reviewer
      { new: true } // Return the updated project document
    );

    res.status(201).json({ message: 'Feedback submitted successfully!', feedback: savedFeedback, projectStatus: updatedProject?.status });

  } catch (error) {
    console.error('Error submitting project feedback:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get feedback for a specific project
export const getProjectFeedback = async (req, res) => {
  try {
    const projectId = req.params.projectId; // Assuming project ID is in URL params

    const feedback = await ProjectFeedback.find({ projectId }).populate('userId'); // Populate user details

    res.json({ feedback });

  } catch (error) {
    console.error('Error fetching project feedback:', error);
    res.status(500).json({ message: error.message });
  }
}; 