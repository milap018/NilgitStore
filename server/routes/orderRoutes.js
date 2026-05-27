import express from "express";
import {
  createCheckoutSession,
  getAllOrders,
  getMyOrders,
  verifyPayment
} from "../controllers/orderController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/checkout", protect, createCheckoutSession);
router.post("/verify-payment", protect, verifyPayment);
router.get("/my-orders", protect, getMyOrders);
router.get("/", protect, adminOnly, getAllOrders);

export default router;
