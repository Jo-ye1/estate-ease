import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { getLeadFiles, uploadLeadFile, deleteLeadFile } from "../controllers/leadFileController.js";

const router = express.Router();

router.get("/leads/:id/files", protect, getLeadFiles);
router.post("/leads/:id/files", protect, upload.single("file"), uploadLeadFile);
router.delete("/files/:id", protect, deleteLeadFile);

export default router;
