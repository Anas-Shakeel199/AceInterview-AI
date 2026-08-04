import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import HTTP_STATUS from "../constants/httpStatus.js";
import dashboardService from "../services/dashboardService.js";

const getDashboardStats = asyncHandler(async (req, res) => {

    const stats = await dashboardService.getDashboardStats(
        req.user._id
    );

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse(
            HTTP_STATUS.OK,
            "Dashboard statistics fetched successfully",
            stats
        )
    );
});

const getRecentInterviews = asyncHandler(async (req, res) => {

    const interviews =
        await dashboardService.getRecentInterviews(
            req.user._id
        );

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse(
            HTTP_STATUS.OK,
            "Recent interviews fetched successfully",
            interviews
        )
    );
});

export {
    getDashboardStats,
    getRecentInterviews,
};