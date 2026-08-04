import User from "../models/userModel.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import HTTP_STATUS from "../constants/httpStatus.js";
import env from "../config/env.js";



const registerUser = async (userData) => {
    const { name, email, password } = userData

    // check if user already exist
    const existingUser = await User.findOne({ email })

    if (existingUser) {
        throw new ApiError(
            HTTP_STATUS.CONFLICT,
            "User with this email already exists"
        );
    }

    //create user
    const user = await User.create({
        name,
        email,
        password,
    });

    // fetch user without sensitive fields
    const createdUser = await User.findById(user._id);

    return createdUser;
};



const loginUser = async (userData) => {
    const { email, password } = userData

    // find user
    const user = await User.findOne({ email })
        .select("+password +refreshToken")

    
    if (!user) {
        throw new ApiError(
            HTTP_STATUS.UNAUTHORIZED,
            "Invalid email or password"
        );
    }

    // validate password 
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(
            HTTP_STATUS.UNAUTHORIZED,
            "Invalid email or password"
        );
    }

    // generateAccessToken & generateRefreshToken
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken();

    // Save Refresh Token
    user.lastLogin = new Date()
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(user._id);

    return {
        user: loggedInUser,
        accessToken,
        refreshToken,
    };

}

const logoutUser = async(userId) => {
    const user = await User.findById(userId).select("+refreshToken");

    if (!user) {
        throw new ApiError(
            HTTP_STATUS.UNAUTHORIZED,
            "Unauthorized access"
        );
    }

    user.refreshToken = "";
    await user.save({
        validateBeforeSave: false
    })

    return;
}

const getCurrentUser = async(user) => {
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}

const refreshAccessToken = async(refreshToken) => {

    if (!refreshToken) {
        throw new ApiError(
            HTTP_STATUS.UNAUTHORIZED,
            "Refresh token is required"
        )
    }

    let decoded;
    try {
        decoded = jwt.verify(
            refreshToken,
            env.JWT_REFRESH_SECRET
        )
    } catch (error) {
        throw new ApiError(
            HTTP_STATUS.UNAUTHORIZED,
            "Invalid or expired refresh token"
        )
    }

    const user = await User.findById(decoded.id)
    .select("+refreshToken")

    if (!user) {
        throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "Unauthorized access"
        )
    }

    if (user.refreshToken !== refreshToken) {
        throw new ApiError(
            HTTP_STATUS.UNAUTHORIZED,
            "Invalid refresh token"
        )
    }

    const accessToken = user.generateAccessToken()

    return {
        accessToken
    }
}

export default { registerUser, loginUser, logoutUser, getCurrentUser, refreshAccessToken };