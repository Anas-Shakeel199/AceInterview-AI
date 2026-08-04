import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import HTTP_STATUS from "../constants/httpStatus.js";
import ApiError from "../utils/ApiError.js";
import authService from "../services/authService.js";
// 1. Named imports import karein
import { accessTokenCookieOptions, refreshTokenCookieOptions } from "../utils/cookieOptions.js";


const registerUser = asyncHandler(async (req, res) => {
    const user = await authService.registerUser(req.body);

    return res.status(HTTP_STATUS.CREATED)
        .json(
            new ApiResponse(
                HTTP_STATUS.CREATED,
                "User registered successfully",
                user
            )
        );
});


const loginUser = asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.loginUser(req.body);

    // 2. .cookie() (singular) use karein aur respective options pass karein
    return res
        .status(HTTP_STATUS.OK)
        .cookie("accessToken", accessToken, accessTokenCookieOptions)
        .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
        .json(
            new ApiResponse(
                HTTP_STATUS.OK,
                "Login successful",
                user
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await authService.logoutUser(req.user._id)

    return res
        .status(HTTP_STATUS.OK)
        .clearCookie("accessToken", accessTokenCookieOptions)
        .clearCookie("refreshToken", refreshTokenCookieOptions)
        .json(
            new ApiResponse(
                HTTP_STATUS.OK,
                "Logged out successfully"
            )
        );
});

const getCurrentUser = asyncHandler(async (req, res) => {

    const user = await authService.getCurrentUser(req.user)

    return res.status(HTTP_STATUS.OK)
    .json(
        new ApiResponse(
            HTTP_STATUS.OK,
            "Current user fetched successfully",
            user
        )
    )
})

const refreshAccessToken = asyncHandler(async (req, res) => {

    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Refresh token is required");
    }

    const { accessToken } = await authService.refreshAccessToken(refreshToken);

    res.cookie(
        "accessToken",
        accessToken,
        accessTokenCookieOptions
    );

    return res.status(HTTP_STATUS.OK)
    .json(
        new ApiResponse(
            HTTP_STATUS.OK,
            "Access token refreshed successfully"
        )
    );
});



export { registerUser, loginUser, logoutUser, getCurrentUser, refreshAccessToken, };