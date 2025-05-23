import Proposal from '../models/Proposal.js';
import Feedback from '../models/ProposalFeedback.js';
import User from '../models/user.model.js';



// Add feedback to a proposal
export const addFeedback = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { projectTitle, sections, attachments, status } = req.body;

    // Validate required fields
    if (!projectTitle || !sections || !sections.length) {
      return res.status(400).json({
        success: false,
        message: 'Project title and at least one section are required'
      });
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ['Pending', 'Approved', 'Rejected', 'Needs Revision'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be one of: Pending, Approved, Rejected, Needs Revision'
        });
      }
    }

    // Find the proposal
    const proposal = await Proposal.findOne({ _id: proposalId });
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found'
      });
    }

    // Verify the user is the assigned teacher
    if (proposal.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the assigned teacher can provide feedback'
      });
    }

    // Create new feedback
    const newFeedback = {
      teacher: req.user._id,
      projectTitle,
      status: status || 'Pending',
      sections,
      attachments: attachments || []
    };

    // Add feedback to the proposal's feedback list
    proposal.feedbackList.push(newFeedback);
    await proposal.save();

    // Populate teacher details
    await proposal.populate('feedbackList.teacher', 'fullName email department');

    res.status(201).json({
      success: true,
      message: 'Feedback added successfully',
      data: proposal.feedbackList[proposal.feedbackList.length - 1]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding feedback',
      error: error.message
    });
  }
};

// Get all feedback for a proposal
export const getProposalFeedback = async (req, res) => {
  try {
    const { proposalId } = req.params;

    const proposal = await Proposal.findOne({ _id: proposalId })
      .populate('feedbackList.teacher', 'fullName email department');

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found'
      });
    }

    res.status(200).json({
      success: true,
      data: proposal.feedbackList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving feedback',
      error: error.message
    });
  }
};

// Update feedback in a proposal
export const updateFeedback = async (req, res) => {
  try {
    const { proposalId, feedbackIndex } = req.params;
    const { projectTitle, sections, attachments, status } = req.body;

    const proposal = await Proposal.findOne({ _id: proposalId });
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found'
      });
    }

    // Verify the feedback exists
    if (!proposal.feedbackList[feedbackIndex]) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Verify the user is the teacher who created the feedback
    if (proposal.feedbackList[feedbackIndex].teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own feedback'
      });
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ['Pending', 'Approved', 'Rejected', 'Needs Revision'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be one of: Pending, Approved, Rejected, Needs Revision'
        });
      }
    }

    // Update feedback
    if (projectTitle) proposal.feedbackList[feedbackIndex].projectTitle = projectTitle;
    if (sections) proposal.feedbackList[feedbackIndex].sections = sections;
    if (attachments) proposal.feedbackList[feedbackIndex].attachments = attachments;
    if (status) proposal.feedbackList[feedbackIndex].status = status;

    await proposal.save();

    // Populate teacher details
    await proposal.populate('feedbackList.teacher', 'fullName email department');

    res.status(200).json({
      success: true,
      message: 'Feedback updated successfully',
      data: proposal.feedbackList[feedbackIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating feedback',
      error: error.message
    });
  }
};

// Delete feedback from a proposal
export const deleteFeedback = async (req, res) => {
  try {
    const { proposalId, feedbackIndex } = req.params;

    const proposal = await Proposal.findOne({ id: proposalId });
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found'
      });
    }

    // Verify the feedback exists
    if (!proposal.feedbackList[feedbackIndex]) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Verify the user is the teacher who created the feedback
    if (proposal.feedbackList[feedbackIndex].teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own feedback'
      });
    }

    // Remove feedback from array
    proposal.feedbackList.splice(feedbackIndex, 1);
    await proposal.save();

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting feedback',
      error: error.message
    });
  }
}; 