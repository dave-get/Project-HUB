import cloudinary from "../config/cloudinary.js";
import upload from "../middleware/multer.js";
import Proposal from "../models/Proposal.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

// Get all proposals for the logged-in student
export const getProposal = async (req, res) => {
  try {
    // Find all proposals where student ID matches the logged-in user's ID
    const proposals = await Proposal.find({ student: req.user._id })
      .populate("student", "fullName email department")
      .populate("teacher", "fullName email department")
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      success: true,
      count: proposals.length,
      data: proposals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving proposals",
      error: error.message,
    });
  }
};

// Update a proposal
export const updateProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findOne({ id: req.params.id });

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    // Only the student who created the proposal can update it
    if (proposal.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this proposal",
      });
    }

    // Don't allow status changes through this endpoint
    delete req.body.status;
    delete req.body.teacher;
    delete req.body.submissionDetails;

    const updatedProposal = await Proposal.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    )
      .populate("student", "fullName email department")
      .populate("teacher", "fullName email department")
      .populate("submissionDetails.submittedTo", "fullName email department");

    res.status(200).json({
      success: true,
      message: "Proposal updated successfully",
      data: updatedProposal,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating proposal",
      error: error.message,
    });
  }
};

// Delete a proposal
export const deleteProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findOne({ id: req.params.id });

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    // Only the student who created the proposal can delete it
    if (proposal.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this proposal",
      });
    }

    await proposal.deleteOne();

    res.status(200).json({
      success: true,
      message: "Proposal deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting proposal",
      error: error.message,
    });
  }
};

// Get all proposals
export const getAllProposals = async (req, res) => {
  try {
    let query = {};

    // If user is a student, only show their proposals
    if (req.user.role === "student") {
      query.student = req.user._id;
    }
    // If user is a teacher, show proposals assigned to them
    else if (req.user.role === "teacher") {
      query.teacher = req.user._id;
    }

    const proposals = await Proposal.find(query)
      .populate("student", "fullName email department")
      .populate("teacher", "fullName email department")
      .populate("submissionDetails.submittedTo", "fullName email department")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: proposals.length,
      data: proposals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving proposals",
      error: error.message,
    });
  }
};

// Middleware to handle file upload
export const uploadProposalFile = (req, res, next) => {
  upload.single("proposalFile")(req, res, (err) => {
    if (err) return next(err);
    
    // Configure upload options for documents
    const uploadOptions = {
      resource_type: "raw", // This allows any file type
      allowed_formats: ["pdf", "doc", "docx", "zip", "txt", "rtf"],
      format: "zip" // Force format for ZIP files
    };

    cloudinary.uploader.upload(req.file.path, uploadOptions, (err, result) => {
      if (err) {
        console.error('Cloudinary upload error:', err);
        return res.status(500).json({
          success: false,
          message: "File upload failed",
          error: err.message
        });
      }
      // Preserve original file info and add Cloudinary data
      req.file = {
        ...req.file,
        secure_url: result.secure_url,
        url: result.url,
        public_id: result.public_id
      };
      next();
    });
  });
};

// Submit a proposal for review
export const submitProposal = async (req, res) => {
  try {
    const { title, teacherId } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!teacherId) {
      return res.status(400).json({
        success: false,
        message: "Teacher ID is required",
      });
    }

    // Validate teacher ID format
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid teacher ID format",
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please ensure you're sending the file as 'proposalFile' in form-data",
      });
    }

    // Validate file upload response
    if (!req.file.secure_url && !req.file.url && !req.file.path) {
      console.error('File upload failed - invalid response:', req.file);
      return res.status(500).json({
        success: false,
        message: "File upload failed - please try again",
        details: "No file URL received from upload service"
      });
    }

    // Verify the teacher exists and is actually a teacher
    const teacher = await User.findOne({
      _id: teacherId,
      role: "teacher",
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found or is not a teacher",
      });
    }

    // Create attachment object
    const attachment = {
      name: req.file.originalname,
      url: req.file.secure_url || req.file.url || req.file.path,
      type: req.file.mimetype,
      size: req.file.size || 0
    };

    // Create new proposal
    const proposal = new Proposal({
      title,
      student: req.user._id,
      teacher: teacherId,
      status: "Pending",
      attachments: [attachment],
    });

    const savedProposal = await proposal.save();

    // Populate student and teacher details
    const populatedProposal = await Proposal.findById(savedProposal._id)
      .populate("student", "fullName email department")
      .populate("teacher", "fullName email department");

    res.status(201).json({
      success: true,
      message: "Proposal submitted successfully",
      data: populatedProposal,
    });
  } catch (error) {
    // Handle multer errors
    if (error.name === "MulterError") {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File size too large. Maximum size is 5MB",
        });
      }
      return res.status(400).json({
        success: false,
        message: `File upload error: ${error.message}`,
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
      return res.status(400).json({
        success: false,
        message: `Validation error: ${validationErrors}`,
      });
    }

    // Handle Cloudinary errors
    if (error.name === "CloudinaryError") {
      return res.status(500).json({
        success: false,
        message: "File upload service error",
        details: error.message
      });
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      message: "Error submitting proposal",
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
