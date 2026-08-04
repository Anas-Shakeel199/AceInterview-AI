<<<<<<< HEAD
import api from "./api.js";

// Dashboard Statistics
const getDashboardStats = async () => {
    const response = await api.get("/dashboard/stats");
    return response.data;
};

// Recent Interviews
const getRecentInterviews = async () => {
    const response = await api.get("/dashboard/recent");
    return response.data;
=======
import Interview from "../models/interviewModel.js";

const getDashboardStats = async (userId) => {

    const totalInterviews = await Interview.countDocuments({
        createdBy: userId,
    });

    const completedInterviews = await Interview.countDocuments({
        createdBy: userId,
        status: "completed",
    });

    const pendingInterviews = await Interview.countDocuments({
        createdBy: userId,
        status: "pending",
    });

    const inProgressInterviews = await Interview.countDocuments({
        createdBy: userId,
        status: "in_progress",
    });

    const scoreStats = await Interview.aggregate([
        {
            $match: {
                createdBy: userId,
                status: "completed",
            },
        },
        {
            $group: {
                _id: null,
                averageScore: {
                    $avg: "$overallScore",
                },
                bestScore: {
                    $max: "$overallScore",
                },
            },
        },
    ]);

    const averageScore =
        scoreStats.length > 0
            ? Math.round(scoreStats[0].averageScore)
            : 0;

    const bestScore =
        scoreStats.length > 0
            ? scoreStats[0].bestScore
            : 0;

    return {
        totalInterviews,
        completedInterviews,
        pendingInterviews,
        inProgressInterviews,
        averageScore,
        bestScore,
    };
};

const getRecentInterviews = async (userId) => {

    const recentInterviews = await Interview.find({
        createdBy: userId,
    })
        .select(
            "title jobRole status overallScore createdAt"
        )
        .sort({
            createdAt: -1,
        })
        .limit(5);

    return recentInterviews;
>>>>>>> 7c039283f9b00a4bd7b102b16ff76eb8c612d712
};

export default {
    getDashboardStats,
    getRecentInterviews,
};