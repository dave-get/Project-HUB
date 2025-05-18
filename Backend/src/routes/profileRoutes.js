import express from "express";
import {
  updateUserProfile,
  getAllUserProfiles,
  getUserById,
} from "../controllers/userProfileController.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protect all routes
router.use(protectRoute);

// Update User's own profile
router.put("/update", updateUserProfile);

// Get all User profiles
router.get("/", getAllUserProfiles);

// Get User profile by ID (for teachers/advisors)
router.get("/:id", getUserById);

export default router;
