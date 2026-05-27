import express from "express";
import { uploadImage } from "../controllers/uploadController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, upload.array("images", 8), uploadImage);

export default router;
