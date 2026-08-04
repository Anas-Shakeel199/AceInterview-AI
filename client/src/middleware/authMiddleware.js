import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import env from "../config/env.js";
import ApiError from "../utils/ApiError.js";
import HTTP_STATUS from "../constants/httpStatus.js";
import asyncHandler from "../utils/asyncHandler.js";

const protect = asyncHandler(async (req, res, next) => {

    const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(
            HTTP_STATUS.UNAUTHORIZED,
            "Authentication required"
        )
    }

    const decode = jwt.verify(
        token,
        env.JWT_ACCESS_SECRET
    )

    const userId = decode._id || decode.id;
    
    const user = await User.findById(decode.id);

    if (!user) {
        throw new ApiError(
            HTTP_STATUS.UNAUTHORIZED,
            "User not found"
        )
    }

    req.user = user
    next()
})

export {protect};
