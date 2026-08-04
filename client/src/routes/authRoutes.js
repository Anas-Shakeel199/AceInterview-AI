import express from "express";
import { getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/authController.js";
import validate from "../middleware/validate.js";
import { loginSchema, registerSchema } from "../validators/authValidator.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post(
  "/register",
  validate(registerSchema),
  registerUser
);

router.post(
  "/login",
  validate(loginSchema),
  loginUser
)

router.post(
  "/logout",
  protect,
  logoutUser
)

router.get(
  "/me",
  protect,
  getCurrentUser
)

router.post(
  "/refresh-token",
  refreshAccessToken
)


export default router;