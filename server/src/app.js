import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import errorMiddleware from "./middleware/errorMiddleware.js"
import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";


const app = express()

// Global Middlewares

app.use(helmet())
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

app.use(morgan("dev"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Routes

app.use("/api/v1/", healthRoutes)

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/interviews", interviewRoutes)

app.use("/api/v1/dashboard", dashboardRoutes)

// 404 Handler

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// error middleware 
app.use(errorMiddleware)

export default app;