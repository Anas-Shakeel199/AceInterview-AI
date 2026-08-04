import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";

import Dashboard from "../pages/dashboard/Dashboard.jsx";

import CreateInterview from "../pages/interview/CreateInterview.jsx";
import InterviewDetails from "../pages/interview/InterviewDetails.jsx";
import StartInterview from "../pages/interview/StartInterview.jsx";
import InterviewResult from "../pages/interview/InterviewResult.jsx";

import Profile from "../pages/profile/Profile.jsx";
import NotFound from "../pages/NotFound.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";

const AppRoutes = () => {
    return (
        <Routes>

            {/* Default Route */}
            <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
            />

            {/* Public Routes */}
            <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>

                <Route path="/dashboard" element={<Dashboard />} />

                <Route
                    path="/interviews/create"
                    element={<CreateInterview />}
                />

                <Route
                    path="/interviews/:id"
                    element={<InterviewDetails />}
                />

                <Route
                    path="/interviews/:id/start"
                    element={<StartInterview />}
                />

                <Route
                    path="/interviews/:id/result"
                    element={<InterviewResult />}
                />

                <Route
                    path="/profile"
                    element={<Profile />}
                />

            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />

        </Routes>
    );
};

export default AppRoutes;