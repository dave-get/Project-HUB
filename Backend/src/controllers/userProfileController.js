import User from '../models/user.model.js';

// Get user profile by ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password'); // Exclude password from response

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user profile',
            error: error.message
        });
    }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User profile not found'
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

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                _id: updatedUser._id,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                role: updatedUser.role,
                department: updatedUser.department,
                bio: updatedUser.bio,
                imageUrl: updatedUser.imageUrl,
                phone: updatedUser.phone,
                location: updatedUser.location,
                socialLinks: updatedUser.socialLinks,
                skills: updatedUser.skills
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

// Get all user profiles
export const getAllUserProfiles = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password'); // Exclude password from response

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user profiles',
            error: error.message
        });
    }
};

export default {
    updateUserProfile,
    getAllUserProfiles,
    getUserById
};
