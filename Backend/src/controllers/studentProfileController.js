import User from '../models/user.model.js';

// Get student profile by ID
export const getStudentById = async (req, res) => {
    try {
        const student = await User.findById(req.params.id)
            .select('-password'); // Exclude password from response
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        if (student.role !== 'student') {
            return res.status(400).json({
                success: false,
                message: 'User is not a student'
            });
        }

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching student profile',
            error: error.message
        });
    }
};

// Update student profile
export const updateStudentProfile = async (req, res) => {
    try {
        const student = await User.findById(req.user._id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        if (student.role !== 'student') {
            return res.status(403).json({
                success: false,
                message: 'User is not a student'
            });
        }

        // Don't allow role or email changes
        delete req.body.role;
        delete req.body.email;

        // Update only allowed fields
        const allowedFields = [
            'fullName',
            'department',
            'bio',
            'phone',
            'location',
            'imageUrl',
            'socialLinks',
            'skills'
        ];

        const updateFields = {};
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateFields[field] = req.body[field];
            }
        });

        const updatedStudent = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                _id: updatedStudent._id,
                fullName: updatedStudent.fullName,
                email: updatedStudent.email,
                role: updatedStudent.role,
                department: updatedStudent.department,
                bio: updatedStudent.bio,
                imageUrl: updatedStudent.imageUrl,
                phone: updatedStudent.phone,
                location: updatedStudent.location,
                socialLinks: updatedStudent.socialLinks,
                skills: updatedStudent.skills
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};

// Get all student profiles (for teachers/advisors)
export const getAllStudentProfiles = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' })
            .select('-password'); // Exclude password from response

        res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching student profiles',
            error: error.message
        });
    }
};

export default {
    updateStudentProfile,
    getAllStudentProfiles,
    getStudentById
}; 