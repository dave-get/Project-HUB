import express from "express";
import {
  signUp,
  login,
  logout,
  getProfile,
  uploadImageFile
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Signup route with image upload middleware
router.post("/signup", uploadImageFile, signUp);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", protectRoute, getProfile);

export default router;
