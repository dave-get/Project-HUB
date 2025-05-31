import express from "express";
import {
  updateUserProfile,
  getAllUserProfiles,
  getUserById,
  uploadProfileImage,
} from "../controllers/userProfileController.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protect all routes
router.use(protectRoute);

// Get all User profiles
router.get("/", getAllUserProfiles);

// Update User's own profile with image upload (must be before /:id route)
router.put("/update", uploadProfileImage, updateUserProfile);

// Get User profile by ID (for teachers/advisors) - must be last
router.get("/:id", getUserById);

export default router;
