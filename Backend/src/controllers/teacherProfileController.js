import User from '../models/user.model.js';

// Get teacher profile
export const getTeacherProfile = async (req, res) => {
  try {
    const teacherProfile = await TeacherProfile.findOne({ id: req.params.id });

    if (!teacherProfile) {
      return res.status(404).json({
        success: false,
        message: 'Teacher profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teacherProfile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving teacher profile',
      error: error.message
    });
  }
};

// Update teacher profile
export const updateTeacherProfile = async (req, res) => {
  try {
    const teacherProfile = await TeacherProfile.findOne({ id: req.params.id });

    if (!teacherProfile) {
      return res.status(404).json({
        success: false,
        message: 'Teacher profile not found'
      });
    }

    // Only the teacher can update their profile
    if (teacherProfile.contact.email !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this profile'
      });
    }

    // Don't allow email changes through this endpoint
    delete req.body.contact?.email;
    delete req.body.basicInfo?.name;

    const updatedProfile = await TeacherProfile.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Teacher profile updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating teacher profile',
      error: error.message
    });
  }
};

// Get all teacher profiles
export const getAllTeacherProfiles = async (req, res) => {
  try {
    const teacherProfiles = await TeacherProfile.find()
      .sort({ 'basicInfo.name': 1 });
    
    res.status(200).json({
      success: true,
      count: teacherProfiles.length,
      data: teacherProfiles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving teacher profiles',
      error: error.message
    });
  }
};