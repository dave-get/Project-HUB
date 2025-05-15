import Proposal from '../models/Proposal.js';
import User from '../models/user.model.js';

// Get all proposals for the logged-in student
export const getProposal = async (req, res) => {
  try {
    // Find all proposals where student ID matches the logged-in user's ID
    const proposals = await Proposal.find({ student: req.user._id })
      .populate('student', 'fullName email department')
      .populate('teacher', 'fullName email department')
      .sort({ createdAt: -1 }); // Sort by newest first
    
    res.status(200).json({
      success: true,
      count: proposals.length,
      data: proposals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving proposals',
      error: error.message
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
        message: 'Proposal not found'
      });
    }

    // Only the student who created the proposal can update it
    if (proposal.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this proposal'
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
    ).populate('student', 'fullName email department')
     .populate('teacher', 'fullName email department')
     .populate('submissionDetails.submittedTo', 'fullName email department');

    res.status(200).json({
      success: true,
      message: 'Proposal updated successfully',
      data: updatedProposal
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating proposal',
      error: error.message
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
        message: 'Proposal not found'
      });
    }

    // Only the student who created the proposal can delete it
    if (proposal.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this proposal'
      });
    }

    await proposal.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Proposal deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting proposal',
      error: error.message
    });
  }
};

// Get all proposals
export const getAllProposals = async (req, res) => {
  try {
    let query = {};
    
    // If user is a student, only show their proposals
    if (req.user.role === 'student') {
      query.student = req.user._id;
    }
    // If user is a teacher, show proposals assigned to them
    else if (req.user.role === 'teacher') {
      query.teacher = req.user._id;
    }

    const proposals = await Proposal.find(query)
      .populate('student', 'fullName email department')
      .populate('teacher', 'fullName email department')
      .populate('submissionDetails.submittedTo', 'fullName email department')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: proposals.length,
      data: proposals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving proposals',
      error: error.message
    });
  }
};

// Submit a proposal for review
export const submitProposal = async (req, res) => {
  try {
    const { title, teacherId, attachment } = req.body;

    // Validate required fields
    if (!title || !teacherId || !attachment) {
      return res.status(400).json({
        success: false,
        message: 'Title, teacher ID, and attachment are required'
      });
    }

    // Validate attachment structure
    if (!attachment.name || !attachment.url || !attachment.type) {
      return res.status(400).json({
        success: false,
        message: 'Attachment must include name, url, and type'
      });
    }

    // Verify the teacher exists and is actually a teacher
    const teacher = await User.findOne({ 
      _id: teacherId,
      role: 'teacher'
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found or invalid'
      });
    }

    // Create new proposal
    const proposal = new Proposal({
      id: `PROP-${Date.now()}`,
      title,
      student: req.user._id,
      teacher: teacherId,
      status: 'Pending',
      submittedAt: new Date(),
      attachments: [attachment],
    });

    await proposal.save();

    // Populate student and teacher details
    await proposal.populate([
      { path: 'student', select: 'fullName email department' },
      { path: 'teacher', select: 'fullName email department' },
      { path: 'submissionDetails.submittedTo', select: 'fullName email department' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Proposal submitted successfully',
      data: proposal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting proposal',
      error: error.message
    });
  }
}; 