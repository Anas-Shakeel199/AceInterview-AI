import express from "express"
import {
    getDashboardStats,
    getRecentInterviews,
} from "../controllers/dashboardController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router()

// dashboard Statistics
router.get(
    "/stats",
    protect,
    getDashboardStats
);

// recents interviews

router.get(
    "/recent",
    protect,
    getRecentInterviews
)

export default router;

