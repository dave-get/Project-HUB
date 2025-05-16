import express from "express";
import {
  getProposal,
  updateProposal,
  deleteProposal,
  getAllProposals,
  submitProposal,
  uploadProposalFile,
} from "../controllers/proposalController.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import checkRole from "../middleware/roleCheck.js";
import feedbackRoutes from "./feedbackRoutes.js";

const router = express.Router();

// Protect all proposal routes
router.use(protectRoute);

// Get all proposals
router.get("/", getAllProposals);

// Get student's proposals
router.get("/my-proposals", checkRole(["student"]), getProposal);

// Get single proposal
router.get("/:id", getProposal);

// Update proposal
router.put("/:id", updateProposal);

// Submit proposal with file upload
router.post(
  "/submit",
  checkRole(["student"]),
  uploadProposalFile,
  submitProposal
);

// Delete proposal
router.delete("/:id", deleteProposal);

// Mount feedback routes
router.use("/:proposalId/feedback", feedbackRoutes);

export default router;
