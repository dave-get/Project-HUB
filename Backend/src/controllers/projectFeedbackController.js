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

// Helper function to safely parse JSON strings from form-data
const safeParseFormDataJson = (value) => {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value; // Return original value if parsing fails
    }
  }
  return value; // Return non-string values directly
};

// Create new project feedback
export const createProjectFeedback = async (req, res) => {
  try {
    const { projectId, teacherId, rating, feedbackText, status } = req.body;
    const files = req.files;
    
    // Validate required fields
    if (!projectId || !teacherId) {
      return res.status(400).json({ message: 'Project ID and Teacher ID are required' });
    }

    // Validate status
    if (!status || !['pending', 'approved', 'rejected', 'need review'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required (pending, approved, rejected, or need review)' });
    }

    // Safely parse collaboratorsId from form-data string if needed
    const collaboratorsId = safeParseFormDataJson(req.body.collaboratorsId);

    // Upload attachments to Cloudinary
    let uploadedAttachments = [];
    if (files && files.length > 0) {
      const attachmentUploadPromises = files.map(file =>
        uploadToCloudinary(file, { folder: 'feedback_attachments' }).then(result => ({
          name: file.originalname,
          url: result.secure_url,
          size: result.bytes
        }))
      );
      uploadedAttachments = await Promise.all(attachmentUploadPromises);
    }

    // First, find the project to ensure it exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Create new feedback document
    const newFeedback = new ProjectFeedback({
      projectId,
      teacherId,
      collaboratorsId: Array.isArray(collaboratorsId) 
        ? collaboratorsId 
        : (collaboratorsId ? [collaboratorsId].filter(Boolean) : []),
      rating,
      feedbackText,
      attachments: uploadedAttachments,
      status: status
    });

    // Save the feedback
    const savedFeedback = await newFeedback.save();

    // Update project status based on feedback status
    const projectStatus = status === 'approved' ? true : false;
    
    // Update the project with new status and reviewer
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { 
        status: projectStatus,
        reviewedByTeacherId: teacherId,
        lastReviewedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      // If project update fails, delete the feedback and return error
      await ProjectFeedback.findByIdAndDelete(savedFeedback._id);
      return res.status(500).json({ message: 'Failed to update project status' });
    }

    res.status(201).json({ 
      message: 'Feedback submitted and project status updated successfully!', 
      feedback: savedFeedback,
      project: updatedProject
    });

  } catch (error) {
    console.error('Error submitting project feedback:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update feedback status
export const updateFeedbackStatus = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected', 'need review'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const feedback = await ProjectFeedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    feedback.status = status;
    const updatedFeedback = await feedback.save();

    // Update project status based on feedback status
    const projectStatus = status === 'approved' ? true : false;
    await Project.findByIdAndUpdate(
      feedback.projectId,
      { 
        status: projectStatus, 
        reviewedByTeacherId: feedback.teacherId 
      }
    );

    res.json({ 
      message: 'Feedback status updated successfully', 
      feedback: updatedFeedback 
    });

  } catch (error) {
    console.error('Error updating feedback status:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get feedback for a specific project
export const getProjectFeedback = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    const feedback = await ProjectFeedback.find({ projectId })
      .populate('teacherId', 'fullName email')
      .populate('collaboratorsId', 'fullName email');

    res.json({ feedback });

  } catch (error) {
    console.error('Error fetching project feedback:', error);
    res.status(500).json({ message: error.message });
  }
}; 