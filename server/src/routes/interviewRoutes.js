import express from "express";
import {
    createInterview,
    deleteInterview,
    evaluateInterview,
    generateQuestions,
    getAllInterviews,
    getInterviewById,
    startInterview,
    submitInterview,
    updateInterview
} from "../controllers/interviewController.js";

import { protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";

import {
    createInterviewSchema,
    updateInterviewSchema
} from "../validators/interviewValidator.js";

const router = express.Router();

// Create Interview + Get All Interviews
router.route("/")
    .post(
        protect,
        validate(createInterviewSchema),
        createInterview
    )
    .get(
        protect,
        getAllInterviews
    );

// Get Single + Update + Delete Interview
router.route("/:id")
    .get(
        protect,
        getInterviewById
    )
    .put(
        protect,
        validate(updateInterviewSchema),
        updateInterview
    )
    .delete(
        protect,
        deleteInterview
    );

// Generate AI Questions
router.post(
    "/:id/generate",
    protect,
    generateQuestions
);

// Start Interview
router.post(
    "/:id/start",
    protect,
    startInterview
);

// submit interview
router.route("/:id/submit")
    .post(
        protect,
        submitInterview
    );

// interview evaluate
router.route("/:id/evaluate")
    .post(
        protect,
        evaluateInterview
    )

export default router;