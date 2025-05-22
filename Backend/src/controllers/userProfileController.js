import User from '../models/user.model.js';
import cloudinary from '../config/cloudinary.js';
import upload from '../middleware/multer.js';
import mongoose from 'mongoose';

// Helper function to safely parse JSON
const safeParseJSON = (str) => {
    try {
        return typeof str === 'string' ? JSON.parse(str) : str;
    } catch (e) {
        console.error('Error parsing JSON:', e);
        return str;
    }
};

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

// Middleware to handle profile image upload
export const uploadProfileImage = (req, res, next) => {
  upload.single("imageUrl")(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({
        success: false,
        message: "Image upload failed",
        error: err.message
      });
    }

    // If no file is uploaded, proceed to next middleware
    if (!req.file) {
      return next();
    }

    // Configure upload options for profile images
    const uploadOptions = {
      folder: 'project-hub/profile-images',
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png"],
      transformation: [
        { width: 500, height: 500, crop: "fill" },
        { quality: "auto" }
      ]
    };

    cloudinary.uploader.upload(req.file.path, uploadOptions, (err, result) => {
      if (err) {
        console.error('Cloudinary upload error:', err);
        return res.status(500).json({
          success: false,
          message: "Image upload to cloud storage failed",
          error: err.message
        });
      }

      if (!result || !result.secure_url) {
        return res.status(500).json({
          success: false,
          message: "Image upload failed - no secure URL received"
        });
      }

      // Add the secure URL to the request body
      req.body.imageUrl = result.secure_url;
      next();
    });
  });
};

// Update user profile
export const updateUserProfile = async (req, res) => {
    try {
        // Verify that we have a valid user ID from the token
        if (!req.user || !req.user._id || !mongoose.Types.ObjectId.isValid(req.user._id)) {
            return res.status(401).json({
                success: false,
                message: 'Invalid user ID'
            });
        }

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

        // Parse socialLinks and skills if they are strings
        if (req.body.socialLinks) {
            req.body.socialLinks = safeParseJSON(req.body.socialLinks);
        }
        if (req.body.skills) {
            req.body.skills = safeParseJSON(req.body.skills);
        }

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
                // For socialLinks, ensure it's an array of objects with platform and url
                if (field === 'socialLinks' && Array.isArray(req.body[field])) {
                    updateFields[field] = req.body[field].map(link => ({
                        platform: link.platform,
                        url: link.url
                    }));
                }
                // For skills, ensure it's an array of strings
                else if (field === 'skills' && Array.isArray(req.body[field])) {
                    updateFields[field] = req.body[field].map(skill => String(skill));
                }
                else {
                    updateFields[field] = req.body[field];
                }
            }
        });

        // If updating image and old image exists, delete it from Cloudinary
        if (updateFields.imageUrl && user.imageUrl) {
            try {
                const publicId = user.imageUrl.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (error) {
                console.error('Error deleting old profile image:', error);
                // Continue with update even if old image deletion fails
            }
        }

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
